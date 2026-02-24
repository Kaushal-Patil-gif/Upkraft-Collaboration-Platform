using Upkart1.Services;

namespace Upkart1.Security
{
    public class JwtAuthenticationMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtAuthenticationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var jwtUtil = context.RequestServices.GetRequiredService<JwtUtil>();
            var userService = context.RequestServices.GetRequiredService<IUserService>();
            
            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
            
            if (authHeader != null && authHeader.StartsWith("Bearer "))
            {
                var token = authHeader.Substring(7);
                
                try
                {
                    if (jwtUtil.ValidateToken(token))
                    {
                        var email = jwtUtil.GetEmailFromToken(token);
                        
                        var userDetails = userService.LoadUserByUsernameAsync(email);
                        
                        if (userDetails != null)
                        {
                            var claims = new List<System.Security.Claims.Claim>
                            {
                                new(System.Security.Claims.ClaimTypes.Email, email),
                                new(System.Security.Claims.ClaimTypes.Role, userDetails.Role.ToString())
                            };
                            
                            var identity = new System.Security.Claims.ClaimsIdentity(claims, "Bearer");
                            context.User = new System.Security.Claims.ClaimsPrincipal(identity);
                        }
                    }
                }
                catch (Exception)
                {
                    // Log error without sensitive details - matching Spring behavior
                }
            }
            
            await _next(context);
        }
    }
}
