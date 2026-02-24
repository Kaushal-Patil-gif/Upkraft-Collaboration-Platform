using Microsoft.Extensions.FileProviders;

namespace Upkart.Api.Configuration;

public class WebConfig
{
    public static void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        var uploadsPath = Path.Combine(env.ContentRootPath, "uploads");
        
        if (!Directory.Exists(uploadsPath))
        {
            Directory.CreateDirectory(uploadsPath);
        }
        
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(uploadsPath),
            RequestPath = "/uploads"
        });
    }
}