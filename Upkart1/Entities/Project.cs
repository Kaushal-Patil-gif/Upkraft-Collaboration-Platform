using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Upkart1.Entities.Enums;

namespace Upkart1.Entities
{
    [Table("projects")]
    public class Project
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Title must contain only alphabets and spaces")]
        [StringLength(20, ErrorMessage = "Title must not exceed 20 characters")]
        [Column("title")]
        public string Title { get; set; } = null!;

        [Required(ErrorMessage = "Description is required")]
        [StringLength(300, ErrorMessage = "Description must not exceed 300 characters")]
        [Column("description", TypeName = "nvarchar(max)")]
        public string Description { get; set; } = null!;

        [Required]
        [Column("price")]
        public double Price { get; set; }

        [Column("creator_id")]
        public long CreatorId { get; set; }
        public User Creator { get; set; } = null!;

        [Column("freelancer_id")]
        public long? FreelancerId { get; set; }
        public User? Freelancer { get; set; }

        [Column("service_id")]
        public long ServiceId { get; set; }
        public Service Service { get; set; } = null!;

        [Column("status")]
        public ProjectStatus Status { get; set; } = ProjectStatus.PENDING;

        [Column("payment_status")]
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.PENDING;

        [Column("escrow_status")]
        public EscrowStatus EscrowStatus { get; set; } = EscrowStatus.Pending;

        [Column("payment_id")]
        public string? PaymentId { get; set; }

        [Column("payment_date")]
        public DateTime? PaymentDate { get; set; }

        [Column("deadline")]
        public DateTime? Deadline { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public List<string>? Milestones { get; set; }

        public ICollection<Message> Messages { get; set; } = new List<Message>();
        public ICollection<ProjectFile> ProjectFiles { get; set; } = new List<ProjectFile>();
        public ICollection<MilestonePayment> MilestonePayments { get; set; } = new List<MilestonePayment>();
        public ICollection<WalletTransaction> WalletTransactions { get; set; } = new List<WalletTransaction>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
