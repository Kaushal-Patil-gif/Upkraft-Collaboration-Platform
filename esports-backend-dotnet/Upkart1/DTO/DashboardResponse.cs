namespace Upkart1.DTO
{
    public class DashboardResponse
    {
        public DashboardStats stats { get; set; }
        public List<ProjectSummary> projects { get; set; }

        public DashboardResponse(DashboardStats stats, List<ProjectSummary> projects)
        {
            this.stats = stats;
            this.projects = projects;
        }

        public class DashboardStats
        {
            public long totalProjects { get; set; }
            public long activeProjects { get; set; }
            public long completedProjects { get; set; }
            public double totalSpent { get; set; }
            public double rating { get; set; }

            public DashboardStats(long totalProjects, long activeProjects, long completedProjects, double totalSpent, double rating)
            {
                this.totalProjects = totalProjects;
                this.activeProjects = activeProjects;
                this.completedProjects = completedProjects;
                this.totalSpent = totalSpent;
                this.rating = rating;
            }
        }

        public class ProjectSummary
        {
            public long id { get; set; }
            public string title { get; set; }
            public string status { get; set; }
            public string freelancer { get; set; }
            public double price { get; set; }

            public ProjectSummary(long id, string title, string status, string freelancer, double price)
            {
                this.id = id;
                this.title = title;
                this.status = status;
                this.freelancer = freelancer;
                this.price = price;
            }
        }
    }
}
