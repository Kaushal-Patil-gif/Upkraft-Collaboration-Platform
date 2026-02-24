using Upkart1.Entities;

namespace Upkart1.repository
{
    public interface IReviewRepository
    {
        Task<List<Review>> FindByServiceOrderByCreatedAtDescAsync(Service service);
        Task<Review?> FindByServiceAndUserAsync(Service service, User user);
        Task<Review?> FindByProjectAndUserAsync(Project project, User user);
        Task<double?> GetAverageRatingByServiceAsync(Service service);
        Task<long> GetReviewCountByServiceAsync(Service service);
        Task<double?> GetAverageRatingByFreelancerAsync(User freelancer);
        Task<double?> FindAverageRatingByFreelancerAsync(User freelancer);
    }
}