using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;
using Upkart1.DTO;
using Upkart1.Exceptions;

namespace Upkart1.Filters
{
    public class RoleAuthorizationFilter : IAuthorizationFilter
    {
        private readonly string[] _requiredRoles;
        
        public RoleAuthorizationFilter(params string[] requiredRoles)
        {
            _requiredRoles = requiredRoles;
        }
        
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;
            
            if (!user.Identity?.IsAuthenticated ?? true)
            {
                var unauthorizedResponse = ApiResponse<object>.ErrorResponse("Authentication required");
                context.Result = new UnauthorizedObjectResult(unauthorizedResponse);
                return;
            }
            
            var userRole = user.FindFirst(ClaimTypes.Role)?.Value;
            
            if (string.IsNullOrEmpty(userRole) || !_requiredRoles.Contains(userRole))
            {
                var forbiddenResponse = ApiResponse<object>.ErrorResponse("Access denied");
                context.Result = new ObjectResult(forbiddenResponse)
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
            }
        }
    }
    
    // Attribute versions for easy use
    public class AdminOnlyAttribute : TypeFilterAttribute
    {
        public AdminOnlyAttribute() : base(typeof(RoleAuthorizationFilter))
        {
            Arguments = new object[] { "ADMIN" };
        }
    }
    
    public class FreelancerOnlyAttribute : TypeFilterAttribute
    {
        public FreelancerOnlyAttribute() : base(typeof(RoleAuthorizationFilter))
        {
            Arguments = new object[] { "FREELANCER", "ADMIN" };
        }
    }
    
    public class CreatorOnlyAttribute : TypeFilterAttribute
    {
        public CreatorOnlyAttribute() : base(typeof(RoleAuthorizationFilter))
        {
            Arguments = new object[] { "CREATOR", "ADMIN" };
        }
    }
}