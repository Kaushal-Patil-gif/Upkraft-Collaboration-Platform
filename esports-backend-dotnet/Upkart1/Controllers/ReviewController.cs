using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Upkart1.DTO;
using Upkart1.Services;

namespace Upkart1.Controllers
{
    [ApiController]
    [Route("api/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("service/{serviceId}")]
        public IActionResult GetServiceReviews(long serviceId)
        {
            try
            {
                var response = _reviewService.GetServiceReviews(serviceId);
                return Ok(response);
            }
            catch (KeyNotFoundException)
            {
                return BadRequest(new { error = "Service not found" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Failed to get reviews" });
            }
        }

        [HttpPost("project/{projectId}")]
        public IActionResult AddReview(long projectId, [FromBody] Dictionary<string, object> reviewData)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                _reviewService.CreateReview(projectId, email, reviewData);
                return Ok(new { message = "Review added successfully" });
            }
            catch (KeyNotFoundException)
            {
                return BadRequest(new { error = "Project not found" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { error = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to add review: " + ex.Message });
            }
        }

        [HttpGet("project/{projectId}/check")]
        public IActionResult CheckProjectReviewed(long projectId)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var hasReviewed = _reviewService.CheckProjectReviewed(projectId, email);
                return Ok(new { hasReviewed });
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Failed to check review status" });
            }
        }
    }
}