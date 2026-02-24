using Microsoft.AspNetCore.Mvc;

namespace Upkart1.Controllers
{
    [ApiController]
    [Route("api/files")]
    public class FileController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly string _uploadDir;

        public FileController(IConfiguration configuration)
        {
            _configuration = configuration;
            _uploadDir = _configuration["file:upload:dir"] ?? "uploads";
        }

        [HttpGet("**")]
        public IActionResult ServeFile([FromQuery] string path)
        {
            try
            {
                var filePath = Path.Combine(_uploadDir, path).Replace("..", "");
                var fullPath = Path.GetFullPath(filePath);
                
                if (System.IO.File.Exists(fullPath))
                {
                    var fileName = Path.GetFileName(fullPath);
                    var fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
                    
                    Response.Headers.Append("Content-Disposition", $"attachment; filename=\"{fileName}\"");
                    return File(fileStream, "application/octet-stream", fileName);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception)
            {
                return NotFound();
            }
        }
    }
}
