using Upkart1.Entities;
using Upkart1.Entities.Enums;

namespace Upkart1.repository
{
    public interface IWalletTransactionRepository
    {
        Task<List<WalletTransaction>> FindByWalletOrderByCreatedAtDescAsync(Wallet wallet);
        Task<WalletTransaction?> FindByProjectAndTypeAsync(Project project, TransactionType type);
    }
}
