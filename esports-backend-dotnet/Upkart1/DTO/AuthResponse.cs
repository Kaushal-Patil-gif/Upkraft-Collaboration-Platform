using Upkart1.Entities;
using Upkart1.Entities.Enums;

namespace Upkart1.DTO
{
    public class AuthResponse
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int Role { get; set; }
        public string Token { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool HasSelectedRole { get; set; }

        public AuthResponse() { }

        public AuthResponse(long id, string name, string email, Role role, string token, DateTime createdAt)
        {
            Id = id;
            Name = name;
            Email = email;
            Role = (int)role;
            Token = token;
            CreatedAt = createdAt;
            HasSelectedRole = true;
        }

        public AuthResponse(long id, string name, string email, Role role, string token, DateTime createdAt, bool hasSelectedRole)
        {
            Id = id;
            Name = name;
            Email = email;
            Role = (int)role;
            Token = token;
            CreatedAt = createdAt;
            HasSelectedRole = hasSelectedRole;
        }
    }
}
