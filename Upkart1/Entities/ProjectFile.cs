using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Upkart1.Entities
{
    [Table("project_files")]
    public class ProjectFile
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Column("project_id")]
        public long ProjectId { get; set; }
        public Project Project { get; set; } = null!;

        [Column("uploader_id")]
        public long UploaderId { get; set; }
        public User Uploader { get; set; } = null!;

        [Required]
        [Column("file_name")]
        public string FileName { get; set; } = null!;

        [Required]
        [Column("file_size")]
        public long FileSize { get; set; }

        [Required]
        [Column("s3_key")]
        public string S3Key { get; set; } = null!;

        [Required]
        [Column("uploaded_at")]
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}
