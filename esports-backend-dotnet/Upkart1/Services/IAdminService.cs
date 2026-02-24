using Upkart1.DTO;

namespace Upkart1.Services
{
    public interface IAdminService
    {
        AdminStatsResponseDTO GetAdminStats();
        List<KycDocumentResponseDTO> GetPendingKycDocuments();
        void ReviewKycDocument(KycReviewRequestDTO request);
        List<AdminUserResponseDTO> GetAllUsers();
        void DeactivateUser(long userId);
        void ActivateUser(long userId);
        void UpdateUser(long userId, UserUpdateRequestDTO request);
        void UpdateUserKycStatus(long userId, string kycStatus);
        List<UserDocumentResponseDTO> GetUserDocuments(long userId);
    }
}
