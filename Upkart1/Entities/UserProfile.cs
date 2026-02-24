using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Upkart1.Entities
{
    [Table("user_profiles")]
    public class UserProfile
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [ForeignKey(nameof(User))]
        [Column("user_id")]
        public long UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; } = null!;

        [RegularExpression(@"^(\S+\s+){0,29}\S*$", ErrorMessage = "Bio must not exceed 30 words")]
        public string? Bio { get; set; }

        public string? Location { get; set; }

        [Url(ErrorMessage = "Website must be a valid URL")]
        public string? Website { get; set; }

        [RegularExpression(@"^(\S+\s+){0,29}\S*$", ErrorMessage = "Skills must not exceed 30 words")]
        public string? Skills { get; set; }

        [Column("professional_name")]
        public string? ProfessionalName { get; set; }

        [Column("channel_name")]
        public string? ChannelName { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
