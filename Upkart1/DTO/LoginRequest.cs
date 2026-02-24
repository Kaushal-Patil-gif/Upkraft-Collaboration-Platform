using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Upkart1.DTO
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Email is required")]
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@(gmail\.com|admin\.com)$", ErrorMessage = "Email must be from gmail.com domain")]
        [JsonPropertyName("email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [JsonPropertyName("password")]
        public string Password { get; set; }
    }
}
