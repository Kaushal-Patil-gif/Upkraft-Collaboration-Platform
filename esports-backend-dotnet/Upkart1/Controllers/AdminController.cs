using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Upkart1.DTO;
using Upkart1.Services;
using Upkart1.Filters;

namespace Upkart1.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [AdminOnly]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("stats")]
        public IActionResult GetAdminStats()
        {
            try
            {
                var stats = _adminService.GetAdminStats();
                return Ok(stats);
            }
            catch (Exception)
            {
                return StatusCode(500, null);
            }
        }

        [HttpGet("kyc/pending")]
        public IActionResult GetPendingKYCDocuments()
        {
            try
            {
                var documents = _adminService.GetPendingKycDocuments();
                return Ok(documents);
            }
            catch (Exception)
            {
                return StatusCode(500, null);
            }
        }

        [HttpPost("kyc/review")]
        public IActionResult ReviewKYCDocument([FromBody] KycReviewRequestDTO request)
        {
            try
            {
                _adminService.ReviewKycDocument(request);
                return Ok(ApiResponse<string>.SuccessResponse($"Document {request.Action}d successfully"));
            }
            catch (FormatException)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse("Invalid request format"));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<string>.ErrorResponse("Verification not found"));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse("Failed to review document"));
            }
        }

        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            try
            {
                var users = _adminService.GetAllUsers();
                return Ok(users);
            }
            catch (Exception)
            {
                return StatusCode(500, null);
            }
        }

        [HttpPut("users/{userId}/deactivate")]
        public IActionResult DeactivateUser(long userId)
        {
            try
            {
                _adminService.DeactivateUser(userId);
                return Ok(ApiResponse<string>.SuccessResponse("User deactivated successfully"));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<string>.ErrorResponse("User not found"));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse("Failed to deactivate user"));
            }
        }

        [HttpPut("users/{userId}/activate")]
        public IActionResult ActivateUser(long userId)
        {
            try
            {
                _adminService.ActivateUser(userId);
                return Ok(ApiResponse<string>.SuccessResponse("User activated successfully"));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<string>.ErrorResponse("User not found"));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse("Failed to activate user"));
            }
        }

        [HttpPut("users/{userId}")]
        public IActionResult UpdateUser(long userId, [FromBody] UserUpdateRequestDTO request)
        {
            try
            {
                _adminService.UpdateUser(userId, request);
                return Ok(ApiResponse<string>.SuccessResponse("User updated successfully"));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<string>.ErrorResponse("User not found"));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse("Failed to update user"));
            }
        }

        [HttpPut("users/{userId}/kyc-status")]
        public IActionResult UpdateUserKycStatus(long userId, [FromBody] KycStatusUpdateDTO request)
        {
            try
            {
                _adminService.UpdateUserKycStatus(userId, request.KycStatus);
                return Ok(ApiResponse<string>.SuccessResponse("KYC status updated successfully"));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<string>.ErrorResponse("User not found"));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<string>.ErrorResponse("Failed to update KYC status"));
            }
        }

        [HttpGet("users/{userId}/documents")]
        public IActionResult GetUserDocuments(long userId)
        {
            try
            {
                var documents = _adminService.GetUserDocuments(userId);
                return Ok(documents);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(null);
            }
            catch (Exception)
            {
                return StatusCode(500, null);
            }
        }
    }
}
