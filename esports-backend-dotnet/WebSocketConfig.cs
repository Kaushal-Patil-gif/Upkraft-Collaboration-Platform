using Microsoft.AspNetCore.SignalR;

namespace Upkart.Api.Configuration;

public class WebSocketConfig
{
    private const string TOPIC_PREFIX = "/topic";
    private const string APP_PREFIX = "/app";
    private const string WS_ENDPOINT = "/ws";
    
    public static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
    {
        var allowedOrigins = configuration["app:cors:allowed-origins"]?.Split(',') 
            ?? new[] { "http://localhost:5173", "http://localhost:3000" };
            
        services.AddSignalR(options =>
        {
            options.EnableDetailedErrors = true;
        });
        
        services.AddCors(options =>
        {
            options.AddPolicy("SignalRCors", policy =>
            {
                policy.WithOrigins(allowedOrigins)
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });
    }
    
    public static void Configure(IApplicationBuilder app)
    {
        app.UseCors("SignalRCors");
    }
}