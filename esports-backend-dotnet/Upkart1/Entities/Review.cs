using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Upkart1.Entities
{
    [Table("reviews")]
    public class Review
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Column("service_id")]
        public long ServiceId { get; set; }
        public Service Service { get; set; } = null!;

        [Column("user_id")]
        public long UserId { get; set; }
        public User User { get; set; } = null!;

        [Column("project_id")]
        public long ProjectId { get; set; }
        public Project Project { get; set; } = null!;

        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5 stars")]
        [Column("rating")]
        public int Rating { get; set; }

        [Column("comment", TypeName = "nvarchar(max)")]
        public string? Comment { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
