using Upkart1.Entities;

namespace Upkart1.repository
{
    public interface IUserRepository
    {
        Task<User?> FindByEmailAsync(string email);
        Task<User?> FindByGoogleIdAsync(string googleId);
        Task<bool> ExistsByEmailAsync(string email);
    }
}