namespace Upkart1.DTO
{
    public class AdminStatsResponseDTO
    {
        public long TotalUsers { get; set; }
        public long ActiveProjects { get; set; }
        public long PendingKyc { get; set; }
        public double TotalProjectValue { get; set; }
        public double PlatformRevenue { get; set; }
        public double FreelancerEarnings { get; set; }
        public double PlatformFeePercentage { get; set; }

        public AdminStatsResponseDTO(long totalUsers, long activeProjects, long pendingKyc, 
            double totalProjectValue, double platformRevenue, double freelancerEarnings, 
            double platformFeePercentage)
        {
            TotalUsers = totalUsers;
            ActiveProjects = activeProjects;
            PendingKyc = pendingKyc;
            TotalProjectValue = totalProjectValue;
            PlatformRevenue = platformRevenue;
            FreelancerEarnings = freelancerEarnings;
            PlatformFeePercentage = platformFeePercentage;
        }
    }
}