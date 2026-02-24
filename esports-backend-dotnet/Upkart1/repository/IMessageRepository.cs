using Upkart1.Entities;

namespace Upkart1.repository
{
    public interface IMessageRepository
    {
        Task<List<Message>> FindByProjectOrderByCreatedAtAscAsync(Project project);
    }
}