using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.Entities;

namespace Upkart1.repository
{
    public class MessageRepository : IMessageRepository
    {
        private readonly ApplicationDbContext _context;

        public MessageRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Message>> FindByProjectOrderByCreatedAtAscAsync(Project project)
        {
            return await _context.Messages
                .Where(m => m.ProjectId == project.Id)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();
        }
    }
}