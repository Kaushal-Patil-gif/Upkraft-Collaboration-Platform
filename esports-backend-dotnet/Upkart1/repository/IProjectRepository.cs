using Upkart1.Entities;
using Upkart1.Entities.Enums;

namespace Upkart1.repository
{
    public interface IProjectRepository
    {
        Task<List<Project>> FindByCreatorAsync(User creator);
        Task<List<Project>> FindByFreelancerAsync(User freelancer);
        Task<List<Project>> FindByCreatorOrderByCreatedAtDescAsync(User creator);
        Task<List<Project>> FindByFreelancerOrderByCreatedAtDescAsync(User freelancer);
        Task<long> CountByStatusAsync(ProjectStatus status);
        Task<double?> SumPriceByPaymentStatusAsync(PaymentStatus paymentStatus);
        Task<List<Project>> FindByCreatorAndPaymentStatusOrderByPaymentDateDescAsync(User creator, PaymentStatus paymentStatus);
        Task<List<Project>> FindByFreelancerAndPaymentStatusOrderByPaymentDateDescAsync(User freelancer, PaymentStatus paymentStatus);
    }
}