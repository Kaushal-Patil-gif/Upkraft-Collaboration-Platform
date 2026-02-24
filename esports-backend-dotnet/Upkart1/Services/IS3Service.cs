namespace Upkart1.Services
{
    public interface IS3Service
    {
        Task<Dictionary<string, string>> Upload(IFormFile file, string folder);
        string GenerateDownloadUrl(string s3Key);
        string GetDownloadUrl(string s3Key);
    }
}
