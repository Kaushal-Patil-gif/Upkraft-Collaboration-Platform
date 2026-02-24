using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Upkart1.DTO;
using Upkart1.Services;

namespace Upkart1.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var user = _userService.GetCurrentUser(email);
                return Ok(user);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("User not found"));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Failed to get user data"));
            }
        }

        [HttpPut("me")]
        public IActionResult UpdateProfile([FromBody] UserProfileUpdateDTO profileData)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var updatedUser = _userService.UpdateUserProfile(email, profileData);
                return Ok(updatedUser);
            }
            catch (Upkart1.Exceptions.ValidationException ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse("Validation failed", ex.ValidationErrors));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("User not found"));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Profile update error: {ex.Message}");
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Failed to update profile"));
            }
        }
    }
}