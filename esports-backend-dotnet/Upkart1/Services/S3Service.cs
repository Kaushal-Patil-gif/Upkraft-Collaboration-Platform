using Amazon;
using Amazon.S3;
using Amazon.S3.Model;

namespace Upkart1.Services
{
    public class S3Service : IS3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucket;

        public S3Service(IConfiguration config)
        {
            _bucket = config["AWS:S3:Bucket"];
            _s3Client = new AmazonS3Client(
                config["AWS:AccessKeyId"],
                config["AWS:SecretAccessKey"],
                RegionEndpoint.GetBySystemName(config["AWS:Region"])
            );
        }

        public async Task<Dictionary<string, string>> Upload(IFormFile file, string folder)
        {
            if (file.Length == 0)
                throw new ArgumentException("File is empty");

            // Allow larger files for project uploads (3GB limit)
            long maxSize = folder.StartsWith("projects/") ? 3L * 1024 * 1024 * 1024 : 5L * 1024 * 1024;
            if (file.Length > maxSize)
            {
                string sizeLimit = folder.StartsWith("projects/") ? "3GB" : "5MB";
                throw new ArgumentException($"Max file size is {sizeLimit}");
            }

            var safeFileName = Guid.NewGuid().ToString() + "." + GetFileExtension(file.FileName);
            var key = $"{folder}/{safeFileName}";

            using var stream = file.OpenReadStream();

            var request = new PutObjectRequest
            {
                BucketName = _bucket,
                Key = key,
                InputStream = stream,
                ContentType = file.ContentType
            };

            await _s3Client.PutObjectAsync(request);

            return new Dictionary<string, string>
            {
                ["key"] = key,
                ["url"] = key  // Store just the key, generate presigned URL when needed
            };
        }

        public string GenerateDownloadUrl(string s3Key)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucket,
                Key = s3Key,
                Expires = DateTime.UtcNow.AddMinutes(15)
            };

            return _s3Client.GetPreSignedURL(request);
        }

        public string GetDownloadUrl(string s3Key)
        {
            return GenerateDownloadUrl(s3Key);
        }

        private string GetFileExtension(string filename)
        {
            if (filename == null || filename.LastIndexOf('.') == -1)
                return "jpg";
            return filename.Substring(filename.LastIndexOf('.') + 1);
        }
    }
}
