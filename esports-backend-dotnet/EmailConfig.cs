using MailKit.Net.Smtp;
using MimeKit;
using MailKit.Security;

namespace Upkart.Api.Configuration;

public class EmailConfig
{
    public static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<SmtpClient>(provider =>
        {
            var emailSection = configuration.GetSection("Email");
            var host = emailSection["Host"];
            var port = int.Parse(emailSection["Port"] ?? "587");
            var username = emailSection["Username"];
            var password = emailSection["Password"];
            
            if (string.IsNullOrEmpty(host?.Trim()))
                throw new ArgumentException("Email host configuration is missing");
            if (string.IsNullOrEmpty(username?.Trim()))
                throw new ArgumentException("Email username configuration is missing");
            if (string.IsNullOrEmpty(password))
                throw new ArgumentException("Email password configuration is missing");
            if (port <= 0 || port > 65535)
                throw new ArgumentException("Invalid email port configuration");
            
            try
            {
                var client = new SmtpClient();
                client.Connect(host.Trim(), port, SecureSocketOptions.StartTls);
                client.Authenticate(username.Trim(), password);
                return client;
            }
            catch (Exception e)
            {
                throw new RuntimeException($"Failed to configure email sender: {e.Message}", e);
            }
        });
    }
}

public class RuntimeException : Exception
{
    public RuntimeException(string message, Exception innerException) : base(message, innerException) { }
}