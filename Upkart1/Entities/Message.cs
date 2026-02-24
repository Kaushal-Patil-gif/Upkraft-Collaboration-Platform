using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Upkart1.Entities
{
    [Table("messages")]
    public class Message
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Column("project_id")]
        public long ProjectId { get; set; }
        public Project Project { get; set; } = null!;

        [Column("sender_id")]
        public long SenderId { get; set; }
        public User Sender { get; set; } = null!;

        [Required]
        [Column("content", TypeName = "nvarchar(max)")]
        public string Content { get; set; } = null!;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
