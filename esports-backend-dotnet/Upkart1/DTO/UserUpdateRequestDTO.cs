using System.ComponentModel.DataAnnotations;

namespace Upkart1.DTO
{
    public class UserUpdateRequestDTO
    {
        [RegularExpression(@"^[a-zA-Z]+(\s[a-zA-Z]+)?$", ErrorMessage = "Name must contain only alphabets and at most one space")]
        public string? name { get; set; }

        [EmailAddress(ErrorMessage = "Email must be valid")]
        public string? email { get; set; }

        [StringLength(int.MaxValue, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
        public string? password { get; set; }
    }
}