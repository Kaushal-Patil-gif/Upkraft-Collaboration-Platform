using Amazon.S3;
using Amazon;

namespace Upkart.Api.Configuration;

public class AwsConfig
{
    public static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
    {
        var awsOptions = configuration.GetSection("AWS");
        
        services.AddSingleton<IAmazonS3>(provider =>
        {
            var config = new AmazonS3Config
            {
                RegionEndpoint = RegionEndpoint.APSouth1
            };
            
            return new AmazonS3Client(
                awsOptions["S3:AccessKeyId"],
                awsOptions["S3:SecretAccessKey"],
                config
            );
        });
    }
}