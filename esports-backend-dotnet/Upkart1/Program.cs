using Upkart1.Configuration;
using Upkart1.Extensions;
using Upkart1.Security;
using Upkart1.Filters;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// ========== Configuration Services ==========
AwsConfig.Configure();
EmailConfig.Configure();
MethodSecurityConfig.Configure();
RateLimitConfig.Configure();
SecurityConfig.Configure();
WebSocketConfig.Configure();

// ========== Dependency Injection ==========
builder.Services.AddApplicationDbContext(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddSignalRServices();
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddCorsPolicy(builder.Configuration);
builder.Services.AddSwaggerDocumentation();

// Controllers with global filters
builder.Services.AddControllers(options =>
{
    // Add global validation filter (equivalent to Spring @Valid)
    options.Filters.Add<ValidationFilter>();
})
.ConfigureApiBehaviorOptions(options =>
{
    // Disable automatic model validation to use our custom ValidationFilter
    options.SuppressModelStateInvalidFilter = true;
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

var app = builder.Build();

// ========== Middleware Pipeline ==========
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Upkart API v1"));
}

// Configure WebConfig for static files
WebConfig.Configure();

// Configure WebSocketConfig
WebSocketConfig.Configure();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseMiddleware<Upkart1.Middleware.GlobalExceptionMiddleware>();
app.UseAuthentication();
app.UseMiddleware<JwtAuthenticationMiddleware>();
app.UseAuthorization();

app.MapControllers();
app.MapHub<Upkart1.Controllers.ChatHub>("/hubs/chat");

app.Run();
