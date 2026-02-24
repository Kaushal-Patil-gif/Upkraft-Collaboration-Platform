using Upkart1.Entities;

namespace Upkart1.repository
{
    public interface IMilestonePaymentRepository
    {
        Task<List<MilestonePayment>> FindByProjectOrderByMilestoneIndexAsync(Project project);
        Task<MilestonePayment?> FindByProjectAndMilestoneIndexAsync(Project project, int milestoneIndex);
    }
}