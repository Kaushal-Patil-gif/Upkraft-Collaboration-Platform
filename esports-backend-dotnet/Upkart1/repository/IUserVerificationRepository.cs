using Upkart1.Entities;
using Upkart1.Entities.Enums;

namespace Upkart1.repository
{
    public interface IUserVerificationRepository
    {
        Task<List<UserVerification>> FindByDocumentStatusAndDocumentUrlIsNotNullAsync(DocumentStatus status);
        Task<List<UserVerification>> FindByDocumentStatusAsync(DocumentStatus status);
        Task<long> CountByDocumentStatusAsync(DocumentStatus status);
    }
}
