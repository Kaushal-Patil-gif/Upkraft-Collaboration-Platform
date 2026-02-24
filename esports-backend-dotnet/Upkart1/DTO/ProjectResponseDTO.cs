namespace Upkart1.DTO
{
    public class ProjectResponseDTO
    {
        public long id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public double price { get; set; }
        public string status { get; set; }
        public string paymentStatus { get; set; }
        public string escrowStatus { get; set; }
        public DateTime deadline { get; set; }
        public List<object> milestones { get; set; }
        public DateTime createdAt { get; set; }
        public UserInfoDTO creator { get; set; }
        public UserInfoDTO freelancer { get; set; }
        public ServiceInfoDTO service { get; set; }

        public ProjectResponseDTO(long id, string title, string description, double price,
            string status, string paymentStatus, string escrowStatus, DateTime deadline,
            List<object> milestones, DateTime createdAt, UserInfoDTO creator,
            UserInfoDTO freelancer, ServiceInfoDTO service)
        {
            this.id = id;
            this.title = title;
            this.description = description;
            this.price = price;
            this.status = status;
            this.paymentStatus = paymentStatus;
            this.escrowStatus = escrowStatus;
            this.deadline = deadline;
            this.milestones = milestones;
            this.createdAt = createdAt;
            this.creator = creator;
            this.freelancer = freelancer;
            this.service = service;
        }

        public class UserInfoDTO
        {
            public long id { get; set; }
            public string name { get; set; }
            public string email { get; set; }
            public string kycStatus { get; set; }

            public UserInfoDTO(long id, string name, string email, string kycStatus)
            {
                this.id = id;
                this.name = name;
                this.email = email;
                this.kycStatus = kycStatus;
            }
        }

        public class ServiceInfoDTO
        {
            public long id { get; set; }
            public string title { get; set; }
            public string category { get; set; }

            public ServiceInfoDTO(long id, string title, string category)
            {
                this.id = id;
                this.title = title;
                this.category = category;
            }
        }
    }
}