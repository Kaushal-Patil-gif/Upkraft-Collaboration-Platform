using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.Entities;

namespace Upkart1.repository
{
    public class MilestonePaymentRepository : IMilestonePaymentRepository
    {
        private readonly ApplicationDbContext _context;

        public MilestonePaymentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<MilestonePayment>> FindByProjectOrderByMilestoneIndexAsync(Project project)
        {
            return await _context.MilestonePayments
                .Where(m => m.ProjectId == project.Id)
                .OrderBy(m => m.MilestoneIndex)
                .ToListAsync();
        }

        public async Task<MilestonePayment?> FindByProjectAndMilestoneIndexAsync(Project project, int milestoneIndex)
        {
            return await _context.MilestonePayments
                .FirstOrDefaultAsync(m => m.ProjectId == project.Id && m.MilestoneIndex == milestoneIndex);
        }
    }
}