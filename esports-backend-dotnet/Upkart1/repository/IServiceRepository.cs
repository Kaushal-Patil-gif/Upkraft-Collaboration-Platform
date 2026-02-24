using Upkart1.Entities;

namespace Upkart1.repository
{
    public interface IServiceRepository
    {
        Task<List<Service>> FindByFreelancerAsync(User freelancer);
        Task<List<Service>> FindByActiveTrueAsync();
    }
}