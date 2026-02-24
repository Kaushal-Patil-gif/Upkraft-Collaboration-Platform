using Microsoft.AspNetCore.Authorization;

namespace Upkart.Api.Configuration;

public class MethodSecurityConfig
{
    public static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", policy => policy.RequireRole("ADMIN"));
            options.AddPolicy("FreelancerOnly", policy => policy.RequireRole("FREELANCER", "ADMIN"));
            options.AddPolicy("CreatorOnly", policy => policy.RequireRole("CREATOR", "ADMIN"));
        });
    }
}