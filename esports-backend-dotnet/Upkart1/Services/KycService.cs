using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.DTO;
using Upkart1.Entities;
using Upkart1.Entities.Enums;

namespace Upkart1.Services
{
    public class KycService : IKycService
    {
        private readonly ApplicationDbContext _context;
        private readonly IS3Service _s3Service;
        private readonly IEmailService _emailService;

        public KycService(ApplicationDbContext context, IS3Service s3Service, IEmailService emailService)
        {
            _context = context;
            _s3Service = s3Service;
            _emailService = emailService;
        }

        public void SendOTP(string email)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            var otp = new Random().Next(100000, 999999).ToString("D6");

            _emailService.SendOTP(user.Email, otp);

            var verification = _context.UserVerifications.FirstOrDefault(v => v.UserId == user.Id)
                ?? new UserVerification { UserId = user.Id };

            if (verification.UserId == 0)
                _context.UserVerifications.Add(verification);

            verification.OtpCode = otp;
            verification.OtpExpiry = DateTime.Now.AddMinutes(10);
            if (verification.DocumentUrl == null)
                verification.DocumentStatus = null;

            _context.SaveChanges();
        }

        public void VerifyOTP(string email, string otp)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            var verification = _context.UserVerifications.FirstOrDefault(v => v.UserId == user.Id);

            if (verification == null || verification.OtpCode == null || verification.OtpCode != otp)
                throw new ArgumentException("Invalid OTP");

            if (verification.OtpExpiry == null || verification.OtpExpiry < DateTime.Now)
                throw new ArgumentException("OTP expired");

            verification.EmailVerified = true;
            verification.VerificationLevel = VerificationLevel.Level1Email;
            verification.OtpCode = null;
            verification.OtpExpiry = null;
            if (verification.DocumentUrl == null)
                verification.DocumentStatus = null;

            _context.SaveChanges();
        }

        public async Task<string> UploadDocument(string email, IFormFile file, string documentType)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            var verification = _context.UserVerifications.FirstOrDefault(v => v.UserId == user.Id);

            if (verification == null || verification.VerificationLevel != VerificationLevel.Level1Email)
                throw new ArgumentException("Email verification required first");

            var folder = $"kyc/user_{user.Id}";
            var s3Data = await _s3Service.Upload(file, folder);
            var documentUrl = s3Data["url"];

            verification.DocumentUrl = documentUrl;
            verification.DocumentType = documentType;
            verification.DocumentUploadedAt = DateTime.Now;
            verification.DocumentStatus = DocumentStatus.Pending;

            _context.SaveChanges();

            return documentUrl;
        }

        public KycStatusResponseDTO GetKYCStatus(string email)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            var verification = _context.UserVerifications.FirstOrDefault(v => v.UserId == user.Id);

            if (verification != null && verification.DocumentUrl == null && verification.DocumentStatus != null)
            {
                verification.DocumentStatus = null;
                _context.SaveChanges();
            }

            return new KycStatusResponseDTO(
                verification?.VerificationLevel.ToString() ?? "UNVERIFIED",
                verification?.EmailVerified ?? false,
                verification?.DocumentUrl != null,
                verification?.DocumentType ?? "",
                verification?.DocumentUrl != null ?
                    (verification.DocumentStatus?.ToString() ?? "PENDING") : "NOT_UPLOADED"
            );
        }
    }
}
