using Upkart1.DTO;
using Upkart1.Entities;

namespace Upkart1.Services
{
    public interface IWalletService
    {
        Dictionary<string, object> HoldEscrow(string userEmail, long projectId, string razorpayPaymentId);
        Dictionary<string, object> ReleaseEscrow(string userEmail, long projectId);
        WalletResponseDTO GetWalletBalance(string userEmail);
        Dictionary<string, object> RequestWithdrawal(string userEmail, WithdrawalRequestDTO request);
        List<WalletTransaction> GetTransactions(string userEmail);
    }
}
