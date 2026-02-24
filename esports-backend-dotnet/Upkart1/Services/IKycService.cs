using Upkart1.DTO;

namespace Upkart1.Services
{
    public interface IKycService
    {
        void SendOTP(string email);
        void VerifyOTP(string email, string otp);
        Task<string> UploadDocument(string email, IFormFile file, string documentType);
        KycStatusResponseDTO GetKYCStatus(string email);
    }
}
