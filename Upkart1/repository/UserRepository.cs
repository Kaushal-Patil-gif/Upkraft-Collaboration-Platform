using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.Entities;

namespace Upkart1.repository
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User?> FindByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> FindByGoogleIdAsync(string googleId)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.GoogleId == googleId);
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _context.Users
                .AnyAsync(u => u.Email == email);
        }
    }
}