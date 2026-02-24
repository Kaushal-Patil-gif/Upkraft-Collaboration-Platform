using Upkart1.Entities;

namespace Upkart1.repository
{
    public interface IProjectFileRepository
    {
        Task<List<ProjectFile>> FindByProjectOrderByUploadedAtDescAsync(Project project);
    }
}