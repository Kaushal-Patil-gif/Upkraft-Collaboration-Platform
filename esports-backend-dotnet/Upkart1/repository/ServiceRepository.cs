using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.Entities;

namespace Upkart1.repository
{
    public class ServiceRepository : IServiceRepository
    {
        private readonly ApplicationDbContext _context;

        public ServiceRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Service>> FindByFreelancerAsync(User freelancer)
        {
            return await _context.Services
                .Where(s => s.FreelancerId == freelancer.Id)
                .ToListAsync();
        }

        public async Task<List<Service>> FindByActiveTrueAsync()
        {
            return await _context.Services
                .Where(s => s.Active)
                .ToListAsync();
        }
    }
}