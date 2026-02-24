using Microsoft.AspNetCore.Mvc;
using Upkart1.DTO;
using Upkart1.Services;

namespace Upkart1.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            var response = _userService.Register(request);
            return Ok(response);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var response = _userService.Login(request);
            return Ok(response);
        }

        [HttpPost("google")]
        public IActionResult GoogleAuth([FromBody] GoogleAuthRequest request)
        {
            try
            {
                var response = _userService.GoogleAuth(request);
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("update-role")]
        public IActionResult UpdateRole([FromBody] UpdateRoleRequest request)
        {
            try
            {
                var response = _userService.UpdateUserRole(request);
                return Ok(response);
            }
            catch (Exception)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse("Failed to update role"));
            }
        }
    }
}
