using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.DTO;
using Upkart1.Entities;
using Upkart1.Entities.Enums;
using Upkart1.Helpers;
using Microsoft.AspNetCore.Identity;

namespace Upkart1.Services
{
    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _context;
        private readonly IS3Service _s3Service;
        private readonly IPasswordHasher<User> _passwordHasher;

        public AdminService(
            ApplicationDbContext context,
            IS3Service s3Service,
            IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _s3Service = s3Service;
            _passwordHasher = passwordHasher;
        }

        public AdminStatsResponseDTO GetAdminStats()
        {
            var totalUsers = _context.Users.Count();
            var activeProjects = _context.Projects.Count(p => p.Status == ProjectStatus.IN_PROGRESS);
            var pendingKyc = _context.UserVerifications.Count(v => v.DocumentStatus == DocumentStatus.Pending);
            
            var totalProjectValue = _context.Projects
                .Where(p => p.PaymentStatus == PaymentStatus.COMPLETED)
                .Sum(p => (double?)p.Price) ?? 0.0;
            
            var platformRevenue = totalProjectValue * 0.30;
            var freelancerEarnings = totalProjectValue - platformRevenue;
            
            return new AdminStatsResponseDTO(
                totalUsers, activeProjects, pendingKyc,
                totalProjectValue, platformRevenue, freelancerEarnings, 30.0
            );
        }

        public List<KycDocumentResponseDTO> GetPendingKycDocuments()
        {
            var pendingDocs = _context.UserVerifications
                .Include(v => v.User)
                .Where(v => v.DocumentStatus == DocumentStatus.Pending)
                .ToList();

            return pendingDocs.Select(verification => {
                string documentUrl = "";
                try
                {
                    if (verification.DocumentUrl != null)
                    {
                        documentUrl = _s3Service.GetDownloadUrl(S3KeyHelper.Extract(verification.DocumentUrl));
                    }
                }
                catch
                {
                    // Log error silently, continue with empty URL
                }

                return new KycDocumentResponseDTO(
                    verification.User.Id,
                    verification.User.Name,
                    verification.User.Email,
                    verification.DocumentType ?? "",
                    documentUrl,
                    verification.DocumentUploadedAt?.ToString() ?? "",
                    verification.DocumentStatus.ToString()
                );
            }).ToList();
        }

        public void ReviewKycDocument(KycReviewRequestDTO request)
        {
            if (request.action != "approve" && request.action != "reject")
            {
                throw new ArgumentException("Invalid action. Must be 'approve' or 'reject'");
            }
            
            var verification = _context.UserVerifications.Find(request.userId)
                ?? throw new KeyNotFoundException("Verification not found");

            if (request.action == "approve")
            {
                verification.DocumentStatus = DocumentStatus.Approved;
                verification.VerificationLevel = VerificationLevel.Level2Document;
            }
            else
            {
                verification.DocumentStatus = DocumentStatus.Rejected;
            }

            verification.AdminRemarks = request.remarks;
            verification.ReviewedAt = DateTime.UtcNow;
            _context.SaveChanges();
        }

        public List<AdminUserResponseDTO> GetAllUsers()
        {
            var users = _context.Users.Include(u => u.Verification).ToList();
            return users.Select(user => {
                string kycStatus = "UNVERIFIED";
                if (user.Verification?.VerificationLevel != null)
                {
                    kycStatus = user.Verification.VerificationLevel.ToString();
                }
                
                return new AdminUserResponseDTO(
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Role.ToString(),
                    kycStatus,
                    user.Active,
                    user.CreatedAt
                );
            }).ToList();
        }

        public void DeactivateUser(long userId)
        {
            var userToDeactivate = _context.Users.Find(userId)
                ?? throw new KeyNotFoundException("User not found");
            
            if (userToDeactivate.Role == Role.ADMIN)
            {
                throw new ArgumentException("Cannot deactivate admin accounts");
            }
            
            if (!userToDeactivate.Active)
            {
                throw new ArgumentException("User is already deactivated");
            }

            userToDeactivate.Active = false;
            _context.SaveChanges();
        }

        public void ActivateUser(long userId)
        {
            var userToActivate = _context.Users.Find(userId)
                ?? throw new KeyNotFoundException("User not found");

            userToActivate.Active = true;
            _context.SaveChanges();
        }

        public void UpdateUser(long userId, UserUpdateRequestDTO request)
        {
            var userToUpdate = _context.Users.Find(userId)
                ?? throw new KeyNotFoundException("User not found");
            
            // Input validation
            if (request.email != null && !string.IsNullOrWhiteSpace(request.email))
            {
                if (!IsValidEmail(request.email.Trim()))
                {
                    throw new ArgumentException("Invalid email format");
                }
                // Check if email already exists for another user
                var existingUser = _context.Users.FirstOrDefault(u => u.Email == request.email.Trim());
                if (existingUser != null && existingUser.Id != userId)
                {
                    throw new ArgumentException("Email already exists");
                }
            }

            // Update fields
            if (request.name != null && !string.IsNullOrWhiteSpace(request.name))
            {
                userToUpdate.Name = request.name.Trim();
            }
            
            if (request.email != null && !string.IsNullOrWhiteSpace(request.email))
            {
                userToUpdate.Email = request.email.Trim();
            }
            
            if (request.password != null && !string.IsNullOrWhiteSpace(request.password))
            {
                if (request.password.Trim().Length < 6)
                {
                    throw new ArgumentException("Password must be at least 6 characters");
                }
                userToUpdate.Password = _passwordHasher.HashPassword(userToUpdate, request.password.Trim());
            }

            _context.SaveChanges();
        }

        public void UpdateUserKycStatus(long userId, string kycStatus)
        {
            var user = _context.Users.Include(u => u.Verification).FirstOrDefault(u => u.Id == userId)
                ?? throw new KeyNotFoundException("User not found");
            
            var verification = user.Verification;
            if (verification == null)
            {
                verification = new UserVerification { UserId = userId, User = user };
                _context.UserVerifications.Add(verification);
            }
            
            if (!Enum.TryParse<VerificationLevel>(kycStatus, out var level))
            {
                throw new ArgumentException($"Invalid KYC status: {kycStatus}");
            }
            
            verification.VerificationLevel = level;
            
            // Update document status based on verification level
            if (level == VerificationLevel.Level2Document)
            {
                verification.DocumentStatus = DocumentStatus.Approved;
            }
            
            _context.SaveChanges();
        }

        public List<UserDocumentResponseDTO> GetUserDocuments(long userId)
        {
            var user = _context.Users.Include(u => u.Verification).FirstOrDefault(u => u.Id == userId)
                ?? throw new KeyNotFoundException("User not found");
            
            var verification = user.Verification;
            if (verification == null || verification.DocumentUrl == null)
            {
                return new List<UserDocumentResponseDTO>();
            }
            
            string documentUrl = "";
            try
            {
                documentUrl = _s3Service.GetDownloadUrl(S3KeyHelper.Extract(verification.DocumentUrl));
            }
            catch
            {
                // Log error silently
            }
            
            var document = new UserDocumentResponseDTO(
                verification.DocumentType ?? "ID",
                documentUrl,
                verification.DocumentUploadedAt ?? DateTime.UtcNow,
                verification.DocumentStatus.ToString()
            );
            
            return new List<UserDocumentResponseDTO> { document };
        }
        
        private bool IsValidEmail(string email)
        {
            return email != null && System.Text.RegularExpressions.Regex.IsMatch(email, @"^[A-Za-z0-9+_.-]+@(.+)$");
        }
    }
}
