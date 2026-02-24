using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Upkart1.Validation;

namespace Upkart1.DTO
{
    public class ProjectCreateDTO
    {
        [Required(ErrorMessage = "Title is required")]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Title must contain only alphabets and spaces")]
        [StringLength(20, ErrorMessage = "Title must not exceed 20 characters")]
        [JsonPropertyName("title")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(300, ErrorMessage = "Description must not exceed 300 characters")]
        [JsonPropertyName("description")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Service ID is required")]
        [JsonPropertyName("serviceId")]
        public long ServiceId { get; set; }

        [Required(ErrorMessage = "Deadline is required")]
        [FutureDateString(ErrorMessage = "Deadline must be in the future")]
        [JsonPropertyName("deadline")]
        public string Deadline { get; set; }

        [Required(ErrorMessage = "At least 2 milestones are required")]
        [MinLength(2, ErrorMessage = "At least 2 milestones are required")]
        [JsonPropertyName("milestones")]
        public List<string> Milestones { get; set; }
    }
}