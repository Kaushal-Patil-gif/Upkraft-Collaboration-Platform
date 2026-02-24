using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.DTO;
using Upkart1.Entities;
using Upkart1.Entities.Enums;

namespace Upkart1.Services
{
    public class ReviewService : IReviewService
    {
        private readonly ApplicationDbContext _context;

        public ReviewService(ApplicationDbContext context)
        {
            _context = context;
        }

        public void CreateReview(long projectId, string email, Dictionary<string, object> reviewData)
        {
            var project = _context.Projects
                .Include(p => p.Service)
                .FirstOrDefault(p => p.Id == projectId)
                ?? throw new KeyNotFoundException("Project not found");

            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            // Only creator can review after project completion
            if (project.CreatorId != user.Id)
                throw new UnauthorizedAccessException("Only project creator can add review");

            if (project.Status != ProjectStatus.COMPLETED)
                throw new ArgumentException("Project must be completed to add review");

            // Check if review already exists for this specific project
            var existingReviews = _context.Reviews
                .Where(r => r.ProjectId == projectId && r.UserId == user.Id)
                .ToList();

            if (existingReviews.Any())
                throw new ArgumentException("You have already reviewed this project");

            var review = new Review
            {
                ServiceId = project.ServiceId,
                UserId = user.Id,
                ProjectId = project.Id,
                Rating = Convert.ToInt32(reviewData["rating"]),
                Comment = reviewData["comment"].ToString()
            };

            _context.Reviews.Add(review);
            _context.SaveChanges();
        }

        public Dictionary<string, object> GetServiceReviews(long serviceId)
        {
            var service = _context.Services.FirstOrDefault(s => s.Id == serviceId);
            if (service == null)
                throw new KeyNotFoundException("Service not found");

            var reviews = _context.Reviews
                .Include(r => r.User)
                .Where(r => r.ServiceId == serviceId)
                .OrderByDescending(r => r.CreatedAt)
                .ToList();

            var avgRating = _context.Reviews
                .Where(r => r.ServiceId == serviceId)
                .Average(r => (double?)r.Rating);

            var reviewCount = _context.Reviews
                .Where(r => r.ServiceId == serviceId)
                .Count();

            var reviewData = reviews.Select(review => new Dictionary<string, object>
            {
                ["id"] = review.Id,
                ["rating"] = review.Rating,
                ["comment"] = review.Comment,
                ["userName"] = review.User.Name,
                ["createdAt"] = review.CreatedAt
            }).ToList();

            return new Dictionary<string, object>
            {
                ["reviews"] = reviewData,
                ["averageRating"] = avgRating != null ? Math.Round(avgRating.Value * 10.0) / 10.0 : 0.0,
                ["reviewCount"] = reviewCount
            };
        }

        public Dictionary<string, object> CheckProjectReviewed(long projectId, string email)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            // Check if review already exists for this specific project by this user
            var existingReviews = _context.Reviews
                .Where(r => r.ProjectId == projectId && r.UserId == user.Id)
                .ToList();

            return new Dictionary<string, object>
            {
                ["hasReviewed"] = existingReviews.Any()
            };
        }
    }
}
