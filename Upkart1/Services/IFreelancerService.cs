using Upkart1.DTO;
using Upkart1.Entities;

namespace Upkart1.Services
{
    public interface IFreelancerService
    {
        Task<Service> CreateService(
            string email,
            string title,
            string description,
            double price,
            int? deliveryTime,
            string category,
            bool active,
            IFormFile? photo1,
            IFormFile? photo2,
            IFormFile? photo3
        );

        List<ServiceResponse> GetFreelancerServices(string email);

        Task<Service> UpdateService(
            string email,
            long id,
            string title,
            string description,
            double price,
            int? deliveryTime,
            string category,
            bool active,
            IFormFile? photo1,
            IFormFile? photo2,
            IFormFile? photo3
        );

        Service GetService(long id);

        void DeleteService(string email, long id);
    }
}
