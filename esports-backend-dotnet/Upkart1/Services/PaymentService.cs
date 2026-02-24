using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.DTO;
using Upkart1.Entities;
using Upkart1.Entities.Enums;

namespace Upkart1.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly ApplicationDbContext _context;

        public PaymentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<PaymentHistoryDTO> GetPaymentHistory(string email)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            if (user.Role == Role.CREATOR)
                return GetCreatorPaymentHistory(user);
            else if (user.Role == Role.FREELANCER)
                return GetFreelancerPaymentHistory(user);

            return new List<PaymentHistoryDTO>();
        }

        private List<PaymentHistoryDTO> GetCreatorPaymentHistory(User creator)
        {
            var projects = _context.Projects
                .Include(p => p.Freelancer)
                .Where(p => p.CreatorId == creator.Id && p.PaymentStatus == PaymentStatus.COMPLETED)
                .OrderByDescending(p => p.PaymentDate)
                .ToList();

            return projects.Select(project =>
            {
                var freelancerName = project.Freelancer?.Name ?? "Unknown";
                return new PaymentHistoryDTO(
                    project.Id,
                    project.Title,
                    project.Price,
                    project.PaymentDate ?? DateTime.MinValue,
                    project.PaymentId,
                    project.Status.ToString(),
                    "PAYMENT_MADE",
                    $"Payment to {freelancerName} for {project.Title}",
                    freelancerName,
                    null, null, null
                );
            }).ToList();
        }

        private List<PaymentHistoryDTO> GetFreelancerPaymentHistory(User freelancer)
        {
            var wallet = _context.Wallets
                .Include(w => w.WalletTransactions)
                    .ThenInclude(t => t.Project)
                        .ThenInclude(p => p.Creator)
                .FirstOrDefault(w => w.UserId == freelancer.Id);

            if (wallet == null) return new List<PaymentHistoryDTO>();

            var transactions = _context.WalletTransactions
                .Include(t => t.Project)
                    .ThenInclude(p => p.Creator)
                .Where(t => t.WalletId == wallet.Id)
                .OrderByDescending(t => t.CreatedAt)
                .ToList();

            return transactions.Select(transaction =>
            {
                string title = "";
                string description = "";
                string creatorName = null;
                string bankAccount = null;
                string ifscCode = null;

                if (transaction.Type == TransactionType.EscrowRelease)
                {
                    title = transaction.Project?.Title ?? "Project Payment";
                    creatorName = transaction.Project?.Creator?.Name ?? "Unknown";
                    description = $"Payment received for {title}";
                }
                else if (transaction.Type == TransactionType.Withdrawal)
                {
                    title = "Withdrawal Request";
                    bankAccount = transaction.BankAccount;
                    ifscCode = transaction.IfscCode;
                    description = "Withdrawal to bank account ****" +
                        (bankAccount != null ? bankAccount.Substring(Math.Max(0, bankAccount.Length - 4)) : "");
                }

                return new PaymentHistoryDTO(
                    transaction.Id,
                    title,
                    transaction.Amount,
                    transaction.CreatedAt,
                    null,
                    transaction.Status.ToString(),
                    transaction.Type.ToString(),
                    description,
                    null,
                    creatorName,
                    bankAccount,
                    ifscCode
                );
            }).ToList();
        }

        public Dictionary<string, object> GenerateInvoice(string email, long projectId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            var project = _context.Projects
                .Include(p => p.Creator)
                .Include(p => p.Freelancer)
                .FirstOrDefault(p => p.Id == projectId)
                ?? throw new KeyNotFoundException("Project not found");

            if (project.CreatorId != user.Id && project.FreelancerId != user.Id)
                throw new UnauthorizedAccessException("Access denied");

            var totalAmount = project.Price;
            var platformFee = totalAmount * 0.30;
            var freelancerAmount = totalAmount - platformFee;

            return new Dictionary<string, object>
            {
                ["invoiceNumber"] = $"INV-{project.Id}-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
                ["projectTitle"] = project.Title,
                ["totalAmount"] = totalAmount,
                ["platformFee"] = platformFee,
                ["freelancerAmount"] = freelancerAmount,
                ["platformFeePercentage"] = 30.0,
                ["paymentDate"] = project.PaymentDate ?? DateTime.Now,
                ["paymentId"] = project.PaymentId ?? "",
                ["creatorName"] = project.Creator.Name,
                ["freelancerName"] = project.Freelancer?.Name ?? "Unknown",
                ["status"] = project.Status.ToString(),
                ["escrowStatus"] = project.EscrowStatus.ToString(),
                ["generatedAt"] = DateTime.Now,
                ["companyName"] = "Upkraft Platform",
                ["companyAddress"] = "Upkraft HQ, RCP Ghansoli, Navi Mumbai - 400701",
                ["companyEmail"] = "upkraft.connect@gmail.com",
                ["companyPhone"] = "+91 0987654321"
            };
        }

        public Dictionary<string, object> ReleaseMilestonePayment(string email, long projectId, Dictionary<string, object> data)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            var project = _context.Projects
                .Include(p => p.Creator)
                .Include(p => p.Freelancer)
                .FirstOrDefault(p => p.Id == projectId)
                ?? throw new KeyNotFoundException("Project not found");

            if (project.CreatorId != user.Id)
                throw new UnauthorizedAccessException("Access denied");

            if (!data.ContainsKey("milestoneIndex") || !data.ContainsKey("amount") || !data.ContainsKey("milestoneTitle"))
                throw new ArgumentException("Missing required milestone data");

            var milestoneIndex = Convert.ToInt32(data["milestoneIndex"]);
            var amount = Convert.ToDouble(data["amount"]);
            var milestoneTitle = data["milestoneTitle"].ToString();

            if (amount <= 0)
                throw new ArgumentException("Amount must be positive");

            var existingPayment = _context.MilestonePayments
                .FirstOrDefault(m => m.ProjectId == project.Id && m.MilestoneIndex == milestoneIndex);

            if (existingPayment != null && existingPayment.Status == PaymentStatus.RELEASED)
                throw new ArgumentException("Milestone payment already released");

            var freelancerWallet = _context.Wallets.FirstOrDefault(w => w.UserId == project.FreelancerId);
            if (freelancerWallet == null)
            {
                freelancerWallet = new Wallet { UserId = project.FreelancerId.Value };
                _context.Wallets.Add(freelancerWallet);
                _context.SaveChanges();
            }

            var platformFee = amount * 0.30;
            var freelancerAmount = amount - platformFee;

            lock (freelancerWallet)
            {
                if (freelancerWallet.EscrowBalance < amount)
                    throw new ArgumentException("Insufficient escrow balance");

                freelancerWallet.EscrowBalance -= amount;
                freelancerWallet.AvailableBalance += freelancerAmount;
            }

            var milestonePayment = existingPayment ?? new MilestonePayment();
            milestonePayment.ProjectId = project.Id;
            milestonePayment.MilestoneIndex = milestoneIndex;
            milestonePayment.MilestoneTitle = milestoneTitle;
            milestonePayment.Amount = amount;
            milestonePayment.Status = PaymentStatus.RELEASED;
            milestonePayment.ReleasedAt = DateTime.Now;

            if (existingPayment == null)
                _context.MilestonePayments.Add(milestonePayment);

            var transaction = new WalletTransaction
            {
                WalletId = freelancerWallet.Id,
                ProjectId = project.Id,
                Amount = freelancerAmount,
                Type = TransactionType.MilestonePayment,
                Status = TransactionStatus.Completed
            };
            _context.WalletTransactions.Add(transaction);

            _context.SaveChanges();

            return new Dictionary<string, object>
            {
                ["message"] = "Milestone payment released successfully",
                ["amount"] = amount,
                ["freelancerAmount"] = freelancerAmount,
                ["platformFee"] = platformFee,
                ["milestoneIndex"] = milestoneIndex
            };
        }

        public List<MilestonePayment> GetMilestonePayments(string email, long projectId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            var project = _context.Projects.FirstOrDefault(p => p.Id == projectId)
                ?? throw new KeyNotFoundException("Project not found");

            if (project.CreatorId != user.Id && project.FreelancerId != user.Id)
                throw new UnauthorizedAccessException("Access denied");

            return _context.MilestonePayments
                .Where(m => m.ProjectId == projectId)
                .OrderBy(m => m.MilestoneIndex)
                .ToList();
        }
    }
}
