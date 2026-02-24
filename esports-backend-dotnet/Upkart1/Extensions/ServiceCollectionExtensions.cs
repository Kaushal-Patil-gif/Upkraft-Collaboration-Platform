using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Upkart1.Configuration;
using Upkart1.Data;
using Upkart1.Entities;
using Upkart1.Filters;
using Upkart1.Security;
using Upkart1.Services;

namespace Upkart1.Extensions;

/// <summary>
/// Centralized service registration (similar to Spring @Configuration + @Bean).
/// Keeps Program.cs clean and groups DI like Spring's config classes.
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers DbContext (equivalent to Spring Data JPA / DataSource).
    /// </summary>
    public static IServiceCollection AddApplicationDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(connectionString, sqlOptions =>
            {
                sqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(30),
                    errorNumbersToAdd: null);
            }));
        return services;
    }

    /// <summary>
    /// Registers all application services (equivalent to Spring @Service component scan).
    /// </summary>
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Filters
        services.AddScoped<RateLimitFilter>();
        services.AddScoped<ValidationFilter>();

        // Security (like Spring Security beans)
        services.AddScoped<JwtUtil>();
        services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

        // Business services (like Spring @Service)
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IAdminService, AdminService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IMarketplaceService, MarketplaceService>();
        services.AddScoped<IWalletService, WalletService>();
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<IKycService, KycService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<IFreelancerService, FreelancerService>();
        services.AddScoped<IS3Service, S3Service>();
        services.AddScoped<IReviewService, ReviewService>();

        return services;
    }

    /// <summary>
    /// Registers SignalR services for real-time communication.
    /// </summary>
    public static IServiceCollection AddSignalRServices(this IServiceCollection services)
    {
        services.AddSignalR();
        return services;
    }

    /// <summary>
    /// Configures JWT authentication (equivalent to Spring SecurityConfig + JwtAuthenticationFilter).
    /// </summary>
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var secret = configuration["Jwt:Secret"] ?? throw new InvalidOperationException("Jwt:Secret is not configured.");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));

        services.AddAuthentication("Bearer")
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

        return services;
    }

    /// <summary>
    /// Configures CORS to match esports-backend SecurityConfig (CorsConfigurationSource).
    /// - Allowed origins from config (cors.allowed-origins in Spring = Cors:AllowedOrigins here).
    /// - Methods: GET, POST, PUT, DELETE, OPTIONS.
    /// - Headers: any (*).
    /// - Credentials: true (for cookies / Authorization).
    /// - Applies to all paths (equivalent to registerCorsConfiguration("/**", ...)).
    /// </summary>
    public static IServiceCollection AddCorsPolicy(this IServiceCollection services, IConfiguration configuration)
    {
        // Same as esports: cors.allowed-origins = http://localhost:5173,http://localhost:3000
        var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
        if (allowedOrigins == null || allowedOrigins.Length == 0)
        {
            // Fallback: support comma-separated string like Spring's cors.allowed-origins
            var originsString = configuration["Cors:AllowedOriginsString"]
                ?? configuration["Cors:AllowedOrigins"];
            allowedOrigins = string.IsNullOrWhiteSpace(originsString?.ToString())
                ? new[] { "http://localhost:5173", "http://localhost:3000" }
                : originsString.ToString()!.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        }

        services.AddCors(options =>
        {
            // Named policy used in pipeline (matches Spring SecurityConfig corsConfigurationSource)
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins(allowedOrigins)
                    .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
            options.AddDefaultPolicy(policy =>
            {
                policy.WithOrigins(allowedOrigins)
                    .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
        });

        return services;
    }

    /// <summary>
    /// Configures Swagger/OpenAPI (equivalent to Springdoc / Swagger in Spring Boot).
    /// </summary>
    public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Upkart API",
                Version = "v1",
                Description = "ASP.NET Core Web API (layered structure similar to Spring Boot)."
            });
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey
            });
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                    },
                    new List<string>()
                }
            });
            
            // Handle file uploads
            c.OperationFilter<FileUploadOperationFilter>();
        });

        return services;
    }
}
