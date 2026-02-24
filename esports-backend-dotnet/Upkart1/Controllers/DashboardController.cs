using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Upkart1.Services;
using Upkart1.Filters;

namespace Upkart1.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("creator")]
        [Authorize]
        public IActionResult GetCreatorDashboard()
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var response = _dashboardService.GetCreatorDashboard(email);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new Dictionary<string, string> { { "error", "User not found" } });
            }
            catch (Exception)
            {
                return StatusCode(500, new Dictionary<string, string> { { "error", "Failed to get creator dashboard" } });
            }
        }

        [HttpGet("freelancer")]
        [Authorize]
        public IActionResult GetFreelancerDashboard()
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var response = _dashboardService.GetFreelancerDashboard(email);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new Dictionary<string, string> { { "error", "User not found" } });
            }
            catch (Exception)
            {
                return StatusCode(500, new Dictionary<string, string> { { "error", "Failed to get freelancer dashboard" } });
            }
        }
    }
}
