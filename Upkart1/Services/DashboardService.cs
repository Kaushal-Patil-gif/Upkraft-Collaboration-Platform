using Microsoft.EntityFrameworkCore;
using Upkart1.Data;
using Upkart1.DTO;
using Upkart1.Entities;
using Upkart1.Entities.Enums;

namespace Upkart1.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly ApplicationDbContext _context;

        public DashboardService(ApplicationDbContext context)
        {
            _context = context;
        }

        public DashboardResponse GetCreatorDashboard(string email)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");
            
            var projects = _context.Projects
                .Include(p => p.Freelancer)
                .Where(p => p.CreatorId == user.Id)
                .OrderByDescending(p => p.CreatedAt)
                .ToList();
            
            var activeProjects = projects.Count(p => p.Status != ProjectStatus.COMPLETED);
            var completedProjects = projects.Count(p => p.Status == ProjectStatus.COMPLETED);
            var totalSpent = projects
                .Where(p => p.PaymentStatus == PaymentStatus.COMPLETED)
                .Sum(p => p.Price);
            
            var stats = new DashboardResponse.DashboardStats(
                projects.Count, activeProjects, completedProjects, totalSpent, 0.0
            );
            
            var projectList = projects.Select(project => new DashboardResponse.ProjectSummary(
                project.Id,
                project.Title,
                FormatStatus(project.Status.ToString()),
                project.Freelancer?.Name ?? "",
                project.Price
            )).ToList();
            
            return new DashboardResponse(stats, projectList);
        }

        public DashboardResponse GetFreelancerDashboard(string email)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");
            
            var projects = _context.Projects
                .Include(p => p.Creator)
                .Where(p => p.FreelancerId == user.Id)
                .OrderByDescending(p => p.CreatedAt)
                .ToList();
            
            var activeProjects = projects.Count(p => p.Status != ProjectStatus.COMPLETED);
            var completedProjects = projects.Count(p => p.Status == ProjectStatus.COMPLETED);
            var totalEarnings = projects
                .Where(p => p.Status == ProjectStatus.COMPLETED && 
                           p.PaymentStatus == PaymentStatus.COMPLETED)
                .Sum(p => p.Price);
            
            // Calculate average rating from reviews
            var avgRating = _context.Reviews
                .Include(r => r.Project)
                .Where(r => r.Project.FreelancerId == user.Id)
                .Average(r => (double?)r.Rating) ?? 0.0;
            var rating = Math.Round(avgRating * 10.0) / 10.0;
            
            var stats = new DashboardResponse.DashboardStats(
                projects.Count, activeProjects, completedProjects, totalEarnings, rating
            );
            
            var projectList = projects.Select(project => new DashboardResponse.ProjectSummary(
                project.Id,
                project.Title,
                FormatStatus(project.Status.ToString()),
                project.Creator?.Name ?? "",
                project.Price
            )).ToList();
            
            return new DashboardResponse(stats, projectList);
        }
        
        private string FormatStatus(string status)
        {
            return status switch
            {
                "IN_PROGRESS" => "In Progress",
                "IN_REVIEW" => "In Review",
                "COMPLETED" => "Completed",
                "PENDING" => "Pending",
                "CANCELLED" => "Cancelled",
                _ => status.Replace("_", " ")
            };
        }
    }
}
