using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.DTO;
using Upkart1.Entities;
using Upkart1.Entities.Enums;

namespace Upkart1.Services
{
    public class WalletService : IWalletService
    {
        private readonly ApplicationDbContext _context;

        public WalletService(ApplicationDbContext context)
        {
            _context = context;
        }

        public Dictionary<string, object> HoldEscrow(string userEmail, long projectId, string razorpayPaymentId)
        {
            var project = _context.Projects
                .Include(p => p.Freelancer)
                .FirstOrDefault(p => p.Id == projectId)
                ?? throw new KeyNotFoundException("Project not found");

            if (project.FreelancerId == null)
                throw new ArgumentException("Project has no assigned freelancer");

            var freelancerWallet = _context.Wallets.FirstOrDefault(w => w.UserId == project.FreelancerId);
            if (freelancerWallet == null)
            {
                freelancerWallet = new Wallet { UserId = project.FreelancerId.Value };
                _context.Wallets.Add(freelancerWallet);
                _context.SaveChanges();
            }

            freelancerWallet.EscrowBalance += project.Price;
            freelancerWallet.UpdatedAt = DateTime.UtcNow;

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

            return new Dictionary<string, object>
            {
                ["message"] = "Payment held in escrow successfully"
            };
        }

        public Dictionary<string, object> ReleaseEscrow(string userEmail, long projectId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == userEmail)
                ?? throw new KeyNotFoundException("User not found");

            var project = _context.Projects.FirstOrDefault(p => p.Id == projectId)
                ?? throw new KeyNotFoundException("Project not found");

            if (project.CreatorId != user.Id)
                throw new UnauthorizedAccessException("Only project creator can release payment");

            var freelancerWallet = _context.Wallets.FirstOrDefault(w => w.UserId == project.FreelancerId)
                ?? throw new KeyNotFoundException("Freelancer wallet not found");

            var currentEscrow = freelancerWallet.EscrowBalance;
            if (currentEscrow < project.Price)
                throw new ArgumentException("Insufficient escrow balance");

            var platformFee = project.Price * 0.30;
            var freelancerAmount = project.Price - platformFee;

            var currentAvailable = freelancerWallet.AvailableBalance;
            freelancerWallet.EscrowBalance = currentEscrow - project.Price;
            freelancerWallet.AvailableBalance = currentAvailable + freelancerAmount;
            freelancerWallet.UpdatedAt = DateTime.Now;

            project.EscrowStatus = EscrowStatus.Released;
            project.Status = ProjectStatus.COMPLETED;
            project.UpdatedAt = DateTime.Now;

            var transaction = new WalletTransaction
            {
                WalletId = freelancerWallet.Id,
                ProjectId = project.Id,
                Amount = freelancerAmount,
                Type = TransactionType.EscrowRelease,
                Status = TransactionStatus.Completed
            };
            _context.WalletTransactions.Add(transaction);

            _context.SaveChanges();

            return new Dictionary<string, object>
            {
                ["message"] = "Payment released successfully",
                ["totalAmount"] = project.Price,
                ["freelancerAmount"] = freelancerAmount,
                ["platformFee"] = platformFee
            };
        }

        public WalletResponseDTO GetWalletBalance(string userEmail)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == userEmail)
                ?? throw new KeyNotFoundException("User not found");

            var wallet = _context.Wallets.FirstOrDefault(w => w.UserId == user.Id);
            if (wallet == null)
            {
                wallet = new Wallet { UserId = user.Id };
                _context.Wallets.Add(wallet);
                _context.SaveChanges();
            }

            var available = wallet.AvailableBalance;
            var escrow = wallet.EscrowBalance;

            return new WalletResponseDTO(available, escrow, available + escrow);
        }

        public Dictionary<string, object> RequestWithdrawal(string userEmail, WithdrawalRequestDTO request)
        {
            if (request.Amount <= 0)
                throw new ArgumentException("Invalid withdrawal amount");

            var user = _context.Users.FirstOrDefault(u => u.Email == userEmail)
                ?? throw new KeyNotFoundException("User not found");

            var wallet = _context.Wallets.FirstOrDefault(w => w.UserId == user.Id)
                ?? throw new KeyNotFoundException("Wallet not found");

            var currentAvailable = wallet.AvailableBalance;
            if (currentAvailable < request.Amount)
                throw new ArgumentException("Insufficient balance");

            wallet.AvailableBalance = currentAvailable - request.Amount;

            var transaction = new WalletTransaction
            {
                WalletId = wallet.Id,
                Amount = request.Amount,
                Type = TransactionType.Withdrawal,
                Status = TransactionStatus.Pending,
                BankAccount = request.BankAccount,
                IfscCode = request.IfscCode
            };
            _context.WalletTransactions.Add(transaction);

            _context.SaveChanges();

            return new Dictionary<string, object>
            {
                ["message"] = "Withdrawal request submitted. Processing within 24-48 hours."
            };
        }

        public List<WalletTransaction> GetTransactions(string userEmail)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == userEmail)
                ?? throw new KeyNotFoundException("User not found");

            var wallet = _context.Wallets.FirstOrDefault(w => w.UserId == user.Id);
            if (wallet == null)
                return new List<WalletTransaction>();

            return _context.WalletTransactions
                .Where(t => t.WalletId == wallet.Id)
                .OrderByDescending(t => t.CreatedAt)
                .ToList();
        }
    }
}
