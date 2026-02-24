using Microsoft.AspNetCore.Mvc;

namespace Upkart1.Controllers
{
    [ApiController]
    [Route("api/test")]
    public class TestController : ControllerBase
    {
        [HttpGet("simple")]
        public IActionResult SimpleTest()
        {
            return Ok(new Dictionary<string, string> { { "message", "Test controller working" } });
        }

        [HttpGet("kyc-test")]
        public IActionResult KycTest()
        {
            return Ok(new Dictionary<string, string> { { "message", "KYC test working" } });
        }

        [HttpGet("port-test")]
        public string PortTest()
        {
            return "Application is running on correct port";
        }
    }
}