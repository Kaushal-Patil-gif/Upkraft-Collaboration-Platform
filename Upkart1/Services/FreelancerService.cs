using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.DTO;
using Upkart1.Entities;
using Upkart1.Entities.Enums;

namespace Upkart1.Services
{
    public class FreelancerService : IFreelancerService
    {
        private readonly ApplicationDbContext _context;
        private readonly IS3Service _s3Service;

        public FreelancerService(ApplicationDbContext context, IS3Service s3Service)
        {
            _context = context;
            _s3Service = s3Service;
        }

        public async Task<Service> CreateService(string email, string title, string description, double price,
                                   int? deliveryTime, string category, bool active,
                                   IFormFile? photo1, IFormFile? photo2, IFormFile? photo3)
        {
            var freelancer = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            var service = new Service
            {
                Title = title,
                Description = description,
                Price = price,
                Category = category,
                DeliveryTime = deliveryTime,
                FreelancerId = freelancer.Id,
                Active = active
            };

            service.Photo1Url = await UploadPhoto(photo1);
            service.Photo2Url = await UploadPhoto(photo2);
            service.Photo3Url = await UploadPhoto(photo3);

            _context.Services.Add(service);
            _context.SaveChanges();
            return service;
        }

        public List<ServiceResponse> GetFreelancerServices(string email)
        {
            var freelancer = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            var services = _context.Services
                .Where(s => s.FreelancerId == freelancer.Id)
                .ToList();

            return services.Select(service => new ServiceResponse(
                service.Id,
                service.Title,
                service.Description,
                service.Price,
                service.DeliveryTime ?? 0,
                service.Category,
                service.Active,
                service.Freelancer?.Name ?? freelancer.Name,
                service.CreatedAt,
                service.UpdatedAt,
                GeneratePhotoUrl(service.Photo1Url),
                GeneratePhotoUrl(service.Photo2Url),
                GeneratePhotoUrl(service.Photo3Url)
            )).ToList();
        }

        public async Task<Service> UpdateService(string email, long id, string title, string description, double price,
                                   int? deliveryTime, string category, bool active,
                                   IFormFile? photo1, IFormFile? photo2, IFormFile? photo3)
        {
            var freelancer = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            var service = _context.Services.FirstOrDefault(s => s.Id == id)
                ?? throw new KeyNotFoundException("Service not found");

            if (service.FreelancerId != freelancer.Id)
                throw new UnauthorizedAccessException("Unauthorized access to service");

            service.Title = title;
            service.Description = description;
            service.Price = price;
            service.Category = category;
            service.DeliveryTime = deliveryTime;
            service.Active = active;

            if (photo1 != null && photo1.Length > 0)
                service.Photo1Url = await UploadPhoto(photo1);
            if (photo2 != null && photo2.Length > 0)
                service.Photo2Url = await UploadPhoto(photo2);
            if (photo3 != null && photo3.Length > 0)
                service.Photo3Url = await UploadPhoto(photo3);

            _context.SaveChanges();
            return service;
        }

        public Service GetService(long id)
        {
            return _context.Services.FirstOrDefault(s => s.Id == id)
                ?? throw new KeyNotFoundException("Service not found");
        }

        public void DeleteService(string email, long id)
        {
            var freelancer = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            var service = _context.Services.FirstOrDefault(s => s.Id == id)
                ?? throw new KeyNotFoundException("Service not found");

            if (service.FreelancerId != freelancer.Id)
                throw new UnauthorizedAccessException("Unauthorized access to service");

            _context.Services.Remove(service);
            _context.SaveChanges();
        }

        private async Task<string?> UploadPhoto(IFormFile? photo)
        {
            if (photo != null && photo.Length > 0)
            {
                try
                {
                    var result = await _s3Service.Upload(photo, "service-photos");
                    return result["url"];
                }
                catch
                {
                    // Log error silently, continue without photo
                    return null;
                }
            }
            return null;
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
