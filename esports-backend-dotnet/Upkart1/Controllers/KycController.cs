using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Upkart1.DTO;
using Upkart1.Services;

namespace Upkart1.Controllers
{
    [ApiController]
    [Route("api/kyc")]
    public class KycController : ControllerBase
    {
        private readonly IKycService _kycService;

        public KycController(IKycService kycService)
        {
            _kycService = kycService;
        }

        [HttpPost("send-otp")]
        [Authorize]
        public IActionResult SendOTP()
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                _kycService.SendOTP(email);
                return Ok(ApiResponse<string>.SuccessResponse("OTP sent successfully"));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("User not found"));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Failed to send OTP"));
            }
        }

        [HttpPost("verify-otp")]
        [Authorize]
        public IActionResult VerifyOTP([FromBody] Dictionary<string, string> request)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var otp = request.GetValueOrDefault("otp");
                _kycService.VerifyOTP(email, otp);
                return Ok(ApiResponse<string>.SuccessResponse("Email verified successfully", "LEVEL_1_EMAIL"));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("User not found"));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Verification failed"));
            }
        }

        [HttpPost("upload-document")]
        [Authorize]
        public async Task<IActionResult> UploadDocument(
            [FromForm] IFormFile file,
            [FromForm] string documentType)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var documentUrl = await _kycService.UploadDocument(email, file, documentType);
                return Ok(ApiResponse<string>.SuccessResponse("Document uploaded successfully", documentUrl));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("User not found"));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Document upload failed"));
            }
        }

        [HttpGet("status")]
        [Authorize]
        public IActionResult GetKYCStatus()
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var status = _kycService.GetKYCStatus(email);
                return Ok(status);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("User not found"));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Failed to fetch KYC status"));
            }
        }
    }
}
