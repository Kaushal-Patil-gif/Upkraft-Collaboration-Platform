using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.Entities;

namespace Upkart1.repository
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly ApplicationDbContext _context;

        public ReviewRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Review>> FindByServiceOrderByCreatedAtDescAsync(Service service)
        {
            return await _context.Reviews
                .Where(r => r.ServiceId == service.Id)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<Review?> FindByServiceAndUserAsync(Service service, User user)
        {
            return await _context.Reviews
                .FirstOrDefaultAsync(r => r.ServiceId == service.Id && r.UserId == user.Id);
        }

        public async Task<Review?> FindByProjectAndUserAsync(Project project, User user)
        {
            return await _context.Reviews
                .FirstOrDefaultAsync(r => r.ProjectId == project.Id && r.UserId == user.Id);
        }

        public async Task<double?> GetAverageRatingByServiceAsync(Service service)
        {
            return await _context.Reviews
                .Where(r => r.ServiceId == service.Id)
                .AverageAsync(r => (double?)r.Rating);
        }

        public async Task<long> GetReviewCountByServiceAsync(Service service)
        {
            return await _context.Reviews
                .LongCountAsync(r => r.ServiceId == service.Id);
        }

        public async Task<double?> GetAverageRatingByFreelancerAsync(User freelancer)
        {
            return await _context.Reviews
                .Include(r => r.Service)
                .Where(r => r.Service.FreelancerId == freelancer.Id)
                .AverageAsync(r => (double?)r.Rating);
        }

        public async Task<double?> FindAverageRatingByFreelancerAsync(User freelancer)
        {
            return await _context.Reviews
                .Include(r => r.Project)
                .Where(r => r.Project.FreelancerId == freelancer.Id)
                .AverageAsync(r => (double?)r.Rating);
        }
    }
}