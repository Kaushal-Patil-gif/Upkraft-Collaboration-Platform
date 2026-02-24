using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Upkart1.Services;
using Upkart1.Filters;

namespace Upkart1.Controllers
{
    [ApiController]
    [Route("api/freelancer")]
    [Authorize]
    public class FreelancerController : ControllerBase
    {
        private readonly IFreelancerService _freelancerService;

        public FreelancerController(IFreelancerService freelancerService)
        {
            _freelancerService = freelancerService;
        }

        [HttpPost("services")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateService(
            [FromForm] string title,
            [FromForm] string description,
            [FromForm] double price,
            [FromForm] int deliveryTime,
            [FromForm] string category,
            [FromForm] bool active,
            [FromForm] IFormFile? photo1,
            [FromForm] IFormFile? photo2,
            [FromForm] IFormFile? photo3)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                Console.WriteLine($"Creating service for email: {email}");
                var service = await _freelancerService.CreateService(
                    email, title, description, price, deliveryTime,
                    category, active, photo1, photo2, photo3
                );
                return Ok(service);
            }
            catch (KeyNotFoundException ex)
            {
                Console.WriteLine($"User not found: {ex.Message}");
                return NotFound(new Dictionary<string, string> { { "error", "User not found" } });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Service creation error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new Dictionary<string, string> { { "error", "Service creation failed" } });
            }
        }

        [HttpGet("services")]
        public IActionResult GetFreelancerServices()
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var services = _freelancerService.GetFreelancerServices(email);
                return Ok(services);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new Dictionary<string, string> { { "error", "User not found" } });
            }
            catch (Exception)
            {
                return StatusCode(500, new Dictionary<string, string> { { "error", "Failed to fetch services" } });
            }
        }

        [HttpPut("services/{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateService(
            long id,
            [FromForm] string title,
            [FromForm] string description,
            [FromForm] double price,
            [FromForm] int deliveryTime,
            [FromForm] string category,
            [FromForm] bool active,
            [FromForm] IFormFile? photo1,
            [FromForm] IFormFile? photo2,
            [FromForm] IFormFile? photo3)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var service = await _freelancerService.UpdateService(
                    email, id, title, description, price, deliveryTime,
                    category, active, photo1, photo2, photo3
                );
                return Ok(new Dictionary<string, object>
                {
                    { "message", "Service updated successfully" },
                    { "service", service }
                });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new Dictionary<string, string> { { "error", "Service or user not found" } });
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403, new Dictionary<string, string> { { "error", "Unauthorized" } });
            }
            catch (Exception)
            {
                return StatusCode(500, new Dictionary<string, string> { { "error", "Failed to update service" } });
            }
        }

        [HttpGet("services/{id}")]
        public IActionResult GetService(long id)
        {
            try
            {
                var service = _freelancerService.GetService(id);
                return Ok(service);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new Dictionary<string, string> { { "error", "Service not found" } });
            }
            catch (Exception)
            {
                return StatusCode(500, new Dictionary<string, string> { { "error", "Failed to fetch service" } });
            }
        }

        [HttpDelete("services/{id}")]
        public IActionResult DeleteService(long id)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                _freelancerService.DeleteService(email, id);
                return Ok(new Dictionary<string, string> { { "message", "Service deleted successfully" } });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new Dictionary<string, string> { { "error", "Service or user not found" } });
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403, new Dictionary<string, string> { { "error", "Unauthorized" } });
            }
            catch (Exception)
            {
                return StatusCode(500, new Dictionary<string, string> { { "error", "Failed to delete service" } });
            }
        }
    }
}
