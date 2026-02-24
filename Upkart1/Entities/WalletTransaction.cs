using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Upkart1.Entities.Enums;

namespace Upkart1.Entities
{
    /// <summary>
    /// Matches esports-backend entity: WalletTransaction (table: wallet_transactions).
    /// </summary>
    [Table("wallet_transactions")]
    public class WalletTransaction
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Column("wallet_id")]
        public long WalletId { get; set; }
        public Wallet Wallet { get; set; } = null!;

        [Column("project_id")]
        public long? ProjectId { get; set; }
        public Project? Project { get; set; }

        [Column("amount")]
        public double Amount { get; set; }

        [Column("type")]
        public TransactionType Type { get; set; }

        [Column("status")]
        public TransactionStatus Status { get; set; }

        [Column("razorpay_payment_id")]
        public string? RazorpayPaymentId { get; set; }

        [Column("bank_account")]
        public string? BankAccount { get; set; }

        [Column("ifsc_code")]
        public string? IfscCode { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
