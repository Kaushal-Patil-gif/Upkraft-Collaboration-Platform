using Upkart1.DTO;

namespace Upkart1.Services
{
    public interface IProjectService
    {
        Dictionary<string, object> CreateProject(string email, ProjectCreateDTO projectData);
        List<ProjectResponseDTO> GetMyProjects(string email);
        ProjectResponseDTO GetProject(string email, long id);
        Dictionary<string, object> UpdatePaymentStatus(string email, long projectId, Dictionary<string, object> paymentData);
        Dictionary<string, object> UpdateProjectStatus(string email, long projectId, Dictionary<string, object> statusData);
        Dictionary<string, object> UpdateMilestones(string email, long projectId, Dictionary<string, object> milestoneData);
        List<Dictionary<string, object>> GetMessages(string email, long projectId);
        Dictionary<string, object> SendMessage(string email, long projectId, Dictionary<string, object> messageData);
        Dictionary<string, object> RejectProject(string email, long projectId);
        Task<Dictionary<string, object>> UploadProjectFile(string email, long projectId, IFormFile file);
        List<Dictionary<string, object>> GetProjectFiles(string email, long projectId);
    }
}
