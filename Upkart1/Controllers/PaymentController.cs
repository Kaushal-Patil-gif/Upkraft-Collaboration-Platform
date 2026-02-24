using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Upkart1.DTO;
using Upkart1.Entities;
using Upkart1.Services;

namespace Upkart1.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet("history")]
        public IActionResult GetPaymentHistory()
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var history = _paymentService.GetPaymentHistory(email);
                return Ok(history);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("User not found"));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Failed to get payment history"));
            }
        }

        [HttpGet("invoice/{projectId}")]
        public IActionResult GenerateInvoice(long projectId)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var invoice = _paymentService.GenerateInvoice(email, projectId);
                return Ok(invoice);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("Project not found"));
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403, ApiResponse<object>.ErrorResponse("Access denied"));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Failed to generate invoice"));
            }
        }

        [HttpPost("milestone/{projectId}/release")]
        [Authorize(Roles = "CREATOR,ADMIN")]
        public IActionResult ReleaseMilestonePayment(long projectId, [FromBody] Dictionary<string, object> data)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var result = _paymentService.ReleaseMilestonePayment(email, projectId, data);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("Project not found"));
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403, ApiResponse<object>.ErrorResponse("Access denied"));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Failed to release milestone payment"));
            }
        }

        [HttpGet("milestones/{projectId}")]
        public IActionResult GetMilestonePayments(long projectId)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var milestones = _paymentService.GetMilestonePayments(email, projectId);
                return Ok(milestones);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("Project not found"));
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403, ApiResponse<object>.ErrorResponse("Access denied"));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Failed to get milestone payments"));
            }
        }
    }
}
