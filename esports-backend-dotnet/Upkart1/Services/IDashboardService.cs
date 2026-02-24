using Upkart1.DTO;

namespace Upkart1.Services
{
    public interface IDashboardService
    {
        DashboardResponse GetCreatorDashboard(string email);
        DashboardResponse GetFreelancerDashboard(string email);
    }
}
