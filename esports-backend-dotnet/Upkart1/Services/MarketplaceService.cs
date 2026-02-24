using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.DTO;
using Upkart1.Entities;

namespace Upkart1.Services
{
    public class MarketplaceService : IMarketplaceService
    {
        private readonly ApplicationDbContext _context;
        private readonly IS3Service _s3Service;

        public MarketplaceService(ApplicationDbContext context, IS3Service s3Service)
        {
            _context = context;
            _s3Service = s3Service;
        }

        public List<MarketplaceServiceDTO> GetAllActiveServices()
        {
            var services = _context.Services.ToList();

            return services.Select(MapToMarketplaceDTO).ToList();
        }

        private MarketplaceServiceDTO MapToMarketplaceDTO(Service service)
        {
            var freelancerProfile = _context.UserProfiles
                .FirstOrDefault(p => p.UserId == service.FreelancerId);

            var avgRating = _context.Reviews
                .Where(r => r.ServiceId == service.Id)
                .Average(r => (double?)r.Rating);

            var reviewCount = _context.Reviews
                .Where(r => r.ServiceId == service.Id)
                .Count();

            var freelancer = _context.Users.FirstOrDefault(u => u.Id == service.FreelancerId);

            return new MarketplaceServiceDTO(
                service.Id,
                service.Title,
                service.Description,
                service.Price,
                service.DeliveryTime ?? 0,
                service.Category,
                service.Active,
                freelancer?.Name ?? "",
                freelancerProfile?.Bio,
                freelancerProfile?.Location,
                freelancerProfile?.Website,
                freelancerProfile?.Skills,
                freelancerProfile?.ProfessionalName,
                GeneratePhotoUrl(service.Photo1Url),
                GeneratePhotoUrl(service.Photo2Url),
                GeneratePhotoUrl(service.Photo3Url),
                avgRating != null ? Math.Round(avgRating.Value * 10.0) / 10.0 : 0.0,
                reviewCount,
                freelancer?.VerificationLevel ?? Entities.Enums.VerificationLevel.Unverified
            );
        }

        private string? GeneratePhotoUrl(string? storedUrl)
        {
            if (storedUrl == null) return null;
            try
            {
                return _s3Service.GenerateDownloadUrl(ExtractS3Key(storedUrl));
            }
            catch
            {
                return null;
            }
        }

        private string ExtractS3Key(string url)
        {
            if (url != null && !url.StartsWith("http"))
                return url;
            if (url != null && url.Contains("service-photos/"))
            {
                var keyPart = url.Substring(url.IndexOf("service-photos/"));
                if (keyPart.Contains("?"))
                    keyPart = keyPart.Substring(0, keyPart.IndexOf("?"));
                return keyPart;
            }
            return url;
        }
    }
}
