using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.Entities;

namespace Upkart1.repository
{
    public class UserProfileRepository : IUserProfileRepository
    {
        private readonly ApplicationDbContext _context;

        public UserProfileRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserProfile?> FindByUserAsync(User user)
        {
            return await _context.UserProfiles
                .FirstOrDefaultAsync(p => p.UserId == user.Id);
        }
    }
}