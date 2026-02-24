using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.Entities;
using Upkart1.Entities.Enums;

namespace Upkart1.repository
{
    public class WalletTransactionRepository : IWalletTransactionRepository
    {
        private readonly ApplicationDbContext _context;

        public WalletTransactionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<WalletTransaction>> FindByWalletOrderByCreatedAtDescAsync(Wallet wallet)
        {
            return await _context.WalletTransactions
                .Where(t => t.WalletId == wallet.Id)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<WalletTransaction?> FindByProjectAndTypeAsync(Project project, TransactionType type)
        {
            return await _context.WalletTransactions
                .FirstOrDefaultAsync(t => t.ProjectId == project.Id && t.Type == type);
        }
    }
}

