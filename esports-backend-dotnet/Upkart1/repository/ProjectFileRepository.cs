using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.Entities;

namespace Upkart1.repository
{
    public class ProjectFileRepository : IProjectFileRepository
    {
        private readonly ApplicationDbContext _context;

        public ProjectFileRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProjectFile>> FindByProjectOrderByUploadedAtDescAsync(Project project)
        {
            return await _context.ProjectFiles
                .Where(f => f.ProjectId == project.Id)
                .OrderByDescending(f => f.UploadedAt)
                .ToListAsync();
        }
    }
}