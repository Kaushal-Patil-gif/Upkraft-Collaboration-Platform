using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Upkart1.Validation;

namespace Upkart1.DTO
{
    [PasswordMatches]
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Name is required")]
        [RegularExpression(@"^[a-zA-Z]+(\s[a-zA-Z]+)?$", ErrorMessage = "Name must contain only alphabets and at most one space")]
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@(gmail\.com|admin\.com)$", ErrorMessage = "Email must be from gmail.com domain")]
        [JsonPropertyName("email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':""\\|,.<>\/?]).{6,}$", ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")]
        [JsonPropertyName("password")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Confirm password is required")]
        [JsonPropertyName("confirmPassword")]
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "Role is required")]
        [RegularExpression(@"^(CREATOR|FREELANCER)$", ErrorMessage = "Role must be either CREATOR or FREELANCER")]
        [JsonPropertyName("role")]
        public string Role { get; set; }
    }
}
