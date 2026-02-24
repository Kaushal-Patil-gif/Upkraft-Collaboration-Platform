namespace Upkart1.DTO
{
    public class AdminUserResponseDTO
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string KycStatus { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedAt { get; set; }

        public AdminUserResponseDTO(long id, string name, string email, string role, 
            string kycStatus, bool active, DateTime createdAt)
        {
            Id = id;
            Name = name;
            Email = email;
            Role = role;
            KycStatus = kycStatus;
            Active = active;
            CreatedAt = createdAt;
        }
    }
}