using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Upkart1.DTO
{
    public class UserProfileUpdateDTO
    {
        [RegularExpression(@"^[a-zA-Z]+(\s[a-zA-Z]+)?$", ErrorMessage = "Name must contain only alphabets and at most one space")]
        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [EmailAddress(ErrorMessage = "Email must be valid")]
        [JsonPropertyName("email")]
        public string? Email { get; set; }

        [RegularExpression(@"^(\S+\s+){0,29}\S*$", ErrorMessage = "Bio must not exceed 30 words")]
        [JsonPropertyName("bio")]
        public string? Bio { get; set; }

        [JsonPropertyName("location")]
        public string? Location { get; set; }

        [JsonPropertyName("website")]
        public string? Website { get; set; }

        [JsonPropertyName("skills")]
        public string? Skills { get; set; }
        
        [JsonPropertyName("professionalName")]
        public string? ProfessionalName { get; set; }
        
        [JsonPropertyName("channelName")]
        public string? ChannelName { get; set; }
    }
}