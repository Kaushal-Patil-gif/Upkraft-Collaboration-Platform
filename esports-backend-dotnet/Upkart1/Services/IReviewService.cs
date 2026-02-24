using Upkart1.DTO;

namespace Upkart1.Services
{
    public interface IReviewService
    {
        void CreateReview(long projectId, string email, Dictionary<string, object> reviewData);
        Dictionary<string, object> GetServiceReviews(long serviceId);
        Dictionary<string, object> CheckProjectReviewed(long projectId, string email);
    }
}
