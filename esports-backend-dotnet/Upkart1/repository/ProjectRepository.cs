using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.Entities;
using Upkart1.Entities.Enums;

namespace Upkart1.repository
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly ApplicationDbContext _context;

        public ProjectRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Project>> FindByCreatorAsync(User creator)
        {
            return await _context.Projects
                .Where(p => p.CreatorId == creator.Id)
                .ToListAsync();
        }

        public async Task<List<Project>> FindByFreelancerAsync(User freelancer)
        {
            return await _context.Projects
                .Where(p => p.FreelancerId == freelancer.Id)
                .ToListAsync();
        }

        public async Task<List<Project>> FindByCreatorOrderByCreatedAtDescAsync(User creator)
        {
            return await _context.Projects
                .Where(p => p.CreatorId == creator.Id)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Project>> FindByFreelancerOrderByCreatedAtDescAsync(User freelancer)
        {
            return await _context.Projects
                .Where(p => p.FreelancerId == freelancer.Id)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<long> CountByStatusAsync(ProjectStatus status)
        {
            return await _context.Projects
                .LongCountAsync(p => p.Status == status);
        }

        public async Task<double?> SumPriceByPaymentStatusAsync(PaymentStatus paymentStatus)
        {
            return await _context.Projects
                .Where(p => p.PaymentStatus == paymentStatus)
                .SumAsync(p => (double?)p.Price);
        }

        public async Task<List<Project>> FindByCreatorAndPaymentStatusOrderByPaymentDateDescAsync(User creator, PaymentStatus paymentStatus)
        {
            return await _context.Projects
                .Where(p => p.CreatorId == creator.Id && p.PaymentStatus == paymentStatus)
                .OrderByDescending(p => p.PaymentDate)
                .ToListAsync();
        }

        public async Task<List<Project>> FindByFreelancerAndPaymentStatusOrderByPaymentDateDescAsync(User freelancer, PaymentStatus paymentStatus)
        {
            return await _context.Projects
                .Where(p => p.FreelancerId == freelancer.Id && p.PaymentStatus == paymentStatus)
                .OrderByDescending(p => p.PaymentDate)
                .ToListAsync();
        }
    }
}