using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Upkart1.DTO;
using Upkart1.Entities;
using Upkart1.Services;
using Upkart1.Data;
using Microsoft.EntityFrameworkCore;
using Upkart1.Entities.Enums;

namespace Upkart1.Controllers
{
    [ApiController]
    [Route("api/wallet")]
    public class WalletController : ControllerBase
    {
        private readonly IWalletService _walletService;
        private readonly ApplicationDbContext _context;

        public WalletController(IWalletService walletService, ApplicationDbContext context)
        {
            _walletService = walletService;
            _context = context;
        }

        [HttpPost("escrow/hold")]
        public IActionResult HoldEscrow([FromBody] Dictionary<string, object> request)
        {
            try
            {
                var projectId = long.Parse(request["projectId"].ToString());
                var razorpayPaymentId = request["razorpayPaymentId"].ToString();
                
                var project = _context.Projects
                    .Include(p => p.Freelancer)
                    .FirstOrDefault(p => p.Id == projectId);
                    
                if (project == null)
                    throw new KeyNotFoundException("Project not found");

                var freelancerWallet = _context.Wallets.FirstOrDefault(w => w.UserId == project.FreelancerId);
                if (freelancerWallet == null)
                {
                    freelancerWallet = new Wallet { UserId = project.FreelancerId.Value };
                    _context.Wallets.Add(freelancerWallet);
                    _context.SaveChanges();
                }

                freelancerWallet.EscrowBalance += project.Price;
                freelancerWallet.UpdatedAt = DateTime.UtcNow;
                _context.Wallets.Update(freelancerWallet);

                var transaction = new WalletTransaction
                {
                    WalletId = freelancerWallet.Id,
                    ProjectId = project.Id,
                    Amount = project.Price,
                    Type = TransactionType.EscrowHold,
                    Status = TransactionStatus.Completed,
                    RazorpayPaymentId = razorpayPaymentId
                };
                _context.WalletTransactions.Add(transaction);
                _context.SaveChanges();

                return Ok(new Dictionary<string, object> { ["message"] = "Payment held in escrow successfully" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { error = "Project not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to hold escrow", details = ex.Message });
            }
        }

        [HttpPost("escrow/release/{projectId}")]
        [Authorize(Roles = "CREATOR,ADMIN")]
        public IActionResult ReleaseEscrow(long projectId)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var result = _walletService.ReleaseEscrow(email, projectId);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("Project or wallet not found"));
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
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Failed to release escrow"));
            }
        }

        [HttpGet("balance")]
        public IActionResult GetWalletBalance()
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var balance = _walletService.GetWalletBalance(email);
                return Ok(balance);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("User not found"));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Failed to get wallet balance"));
            }
        }

        [HttpPost("withdraw/request")]
        [Authorize(Roles = "FREELANCER,ADMIN")]
        public IActionResult RequestWithdrawal([FromBody] WithdrawalRequestDTO request)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var result = _walletService.RequestWithdrawal(email, request);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("User or wallet not found"));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Failed to request withdrawal"));
            }
        }

        [HttpGet("transactions")]
        public IActionResult GetTransactions()
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var transactions = _walletService.GetTransactions(email);
                return Ok(transactions);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("User not found"));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Failed to get transactions"));
            }
        }
    }
}
