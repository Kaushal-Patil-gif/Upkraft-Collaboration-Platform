using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.Entities;
using Upkart1.Entities.Enums;

namespace Upkart1.repository
{
    public class UserVerificationRepository : IUserVerificationRepository
    {
        private readonly ApplicationDbContext _context;

        public UserVerificationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserVerification>> FindByDocumentStatusAndDocumentUrlIsNotNullAsync(
            DocumentStatus status)
        {
            return await _context.UserVerifications
                .Where(v =>
                    v.DocumentStatus == status &&
                    v.DocumentUrl != null)
                .ToListAsync();
        }

        public async Task<List<UserVerification>> FindByDocumentStatusAsync(
            DocumentStatus status)
        {
            return await _context.UserVerifications
                .Where(v => v.DocumentStatus == status)
                .ToListAsync();
        }

        public async Task<long> CountByDocumentStatusAsync(
            DocumentStatus status)
        {
            return await _context.UserVerifications
                .LongCountAsync(v => v.DocumentStatus == status);
        }
    }
}
