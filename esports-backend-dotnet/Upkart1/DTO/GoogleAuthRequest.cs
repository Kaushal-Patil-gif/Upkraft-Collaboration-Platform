using System.ComponentModel.DataAnnotations;

namespace Upkart1.DTO
{
    public class GoogleAuthRequest
    {
        [Required]
        public string Token { get; set; }
    }
}
