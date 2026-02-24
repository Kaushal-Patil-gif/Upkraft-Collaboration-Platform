using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Upkart1.Entities.Enums;

namespace Upkart1.Entities
{
    /// <summary>
    /// Matches esports-backend entity: MilestonePayment (table: milestone_payments).
    /// Java uses inner enum PaymentStatus: PENDING, RELEASED.
    /// </summary>
    [Table("milestone_payments")]
    public class MilestonePayment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Column("project_id")]
        public long ProjectId { get; set; }
        public Project Project { get; set; } = null!;

        [Column("milestone_index")]
        public int MilestoneIndex { get; set; }

        [Column("milestone_title")]
        public string? MilestoneTitle { get; set; }

        [Column("amount")]
        public double Amount { get; set; }

        [Column("status")]
        public PaymentStatus Status { get; set; } = PaymentStatus.PENDING;

        [Column("released_at")]
        public DateTime? ReleasedAt { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
