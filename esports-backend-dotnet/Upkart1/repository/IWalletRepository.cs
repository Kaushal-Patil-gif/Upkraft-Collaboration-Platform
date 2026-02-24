using Upkart1.Entities;

namespace Upkart1.repository
{
    public interface IWalletRepository
    {
        Task<Wallet?> FindByUserAsync(User user);
    }
}