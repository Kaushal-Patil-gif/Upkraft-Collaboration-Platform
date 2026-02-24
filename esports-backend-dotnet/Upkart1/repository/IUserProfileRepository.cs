using Upkart1.Entities;

namespace Upkart1.repository
{
    public interface IUserProfileRepository
    {
        Task<UserProfile?> FindByUserAsync(User user);
    }
}