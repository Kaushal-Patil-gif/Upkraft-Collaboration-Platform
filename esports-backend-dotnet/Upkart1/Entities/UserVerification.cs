using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Upkart1.Entities.Enums;

namespace Upkart1.Entities
{
    [Table("user_verifications")]
    public class UserVerification
    {
        [Key]
        [Column("user_id")]
        public long UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; } = null!;

        // Verification level
        [Column("verification_level", TypeName = "varchar(20)")]
        public VerificationLevel VerificationLevel { get; set; }
            = VerificationLevel.Unverified;

        // OTP
        [Column("otp_code")]
        public string? OtpCode { get; set; }

        [Column("otp_expiry")]
        public DateTime? OtpExpiry { get; set; }

        [Column("email_verified")]
        public bool EmailVerified { get; set; } = false;

        // Document (uploaded later)
        [Column("document_url")]
        public string? DocumentUrl { get; set; }

        [Column("document_type")]
        public string? DocumentType { get; set; }

        [Column("document_uploaded_at")]
        public DateTime? DocumentUploadedAt { get; set; }

        [Column("document_status", TypeName = "varchar(20)")]
        public DocumentStatus? DocumentStatus { get; set; }

        // Admin review (later)
        [Column("admin_remarks")]
        public string? AdminRemarks { get; set; }

        [Column("reviewed_at")]
        public DateTime? ReviewedAt { get; set; }

        // Audit
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

}
