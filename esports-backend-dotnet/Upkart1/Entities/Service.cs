using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Upkart1.Entities
{
    [Table("services")]
    public class Service
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        [Column("freelancer_id")]
        public long FreelancerId { get; set; }
        public User Freelancer { get; set; } = null!;

        [Required]
        [Column("title")]
        public string Title { get; set; } = null!;

        [Column("description", TypeName = "nvarchar(max)")]
        public string? Description { get; set; }

        [Required]
        [Column("price")]
        public double Price { get; set; }

        [Column("delivery_time")]
        public int? DeliveryTime { get; set; }

        [Column("category")]
        public string? Category { get; set; }

        [Column("is_active")]
        public bool Active { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Column("photo1_url", TypeName = "nvarchar(max)")]
        public string? Photo1Url { get; set; }

        [Column("photo2_url", TypeName = "nvarchar(max)")]
        public string? Photo2Url { get; set; }

        [Column("photo3_url", TypeName = "nvarchar(max)")]
        public string? Photo3Url { get; set; }

        public ICollection<Project> Projects { get; set; } = new List<Project>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
