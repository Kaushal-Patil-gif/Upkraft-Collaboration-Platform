using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Upkart1.Entities
{
    [Table("wallets")]
    public class Wallet
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Column("user_id")]
        public long UserId { get; set; }
        public User User { get; set; } = null!;

        [Required]
        [Column("available_balance")]
        public double AvailableBalance { get; set; } = 0.0;

        [Required]
        [Column("escrow_balance")]
        public double EscrowBalance { get; set; } = 0.0;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<WalletTransaction> WalletTransactions { get; set; } = new List<WalletTransaction>();

        // Null-safe balance operations matching Spring backend
        public void AddToAvailableBalance(double? amount)
        {
            if (amount != null && amount > 0)
            {
                AvailableBalance += amount.Value;
            }
        }

        public void SubtractFromAvailableBalance(double? amount)
        {
            if (amount != null && amount > 0)
            {
                AvailableBalance = Math.Max(0.0, AvailableBalance - amount.Value);
            }
        }

        public void AddToEscrowBalance(double? amount)
        {
            if (amount != null && amount > 0)
            {
                EscrowBalance += amount.Value;
            }
        }

        public void SubtractFromEscrowBalance(double? amount)
        {
            if (amount != null && amount > 0)
            {
                EscrowBalance = Math.Max(0.0, EscrowBalance - amount.Value);
            }
        }
    }
}
