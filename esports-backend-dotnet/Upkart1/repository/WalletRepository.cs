using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.Entities;

namespace Upkart1.repository
{
    public class WalletRepository : IWalletRepository
    {
        private readonly ApplicationDbContext _context;

        public WalletRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Wallet?> FindByUserAsync(User user)
        {
            return await _context.Wallets
                .FirstOrDefaultAsync(w => w.UserId == user.Id);
        }
    }
}