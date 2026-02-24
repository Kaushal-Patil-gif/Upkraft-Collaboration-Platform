using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Upkart1.DTO
{
    public class UpdateRoleRequest
    {
        [Required(ErrorMessage = "User ID is required")]
        [JsonPropertyName("userId")]
        public long UserId { get; set; }
        
        [Required(ErrorMessage = "Role is required")]
        [JsonPropertyName("role")]
        public string Role { get; set; }
    }
}