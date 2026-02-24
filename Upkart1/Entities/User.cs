using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Upkart1.Entities.Enums;

namespace Upkart1.Entities
{
    [Table("users")]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [RegularExpression(@"^[a-zA-Z]+(\s[a-zA-Z]+)?$", ErrorMessage = "Name must contain only alphabets and at most one space")]
        [Column("name")]
        public string Name { get; set; } = null!;

        [Required(ErrorMessage = "Email is required")]
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@(gmail\.com|admin\.com)$", ErrorMessage = "Email must be from gmail.com domain")]
        [Column("email")]
        public string Email { get; set; } = null!;

        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':""\\|,.<>\/?]).{6,}$", ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")]
        [Column("password")]
        public string? Password { get; set; }

        [Column("google_id")]
        public string? GoogleId { get; set; }

        [Column("role")]
        public Role Role { get; set; } = Role.CREATOR;

        [Column("active")]
        public bool Active { get; set; } = true;

        [Column("has_selected_role")]
        public bool HasSelectedRole { get; set; } = false;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public VerificationLevel VerificationLevel => Verification?.VerificationLevel ?? VerificationLevel.Unverified;

        public UserProfile? Profile { get; set; }
        public UserVerification? Verification { get; set; }
        public Wallet? Wallet { get; set; }

        public ICollection<Project> CreatedProjects { get; set; } = new List<Project>();
        public ICollection<Project> FreelanceProjects { get; set; } = new List<Project>();
        public ICollection<Service> Services { get; set; } = new List<Service>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
