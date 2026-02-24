using Microsoft.AspNetCore.Mvc;

namespace Upkart1.Controllers
{
    [ApiController]
    [Route("ws")]
    public class WebSocketController : ControllerBase
    {
        [HttpGet("info")]
        public IActionResult GetWebSocketInfo()
        {
            var info = new
            {
                websocket = true,
                origins = new[] { "*:*" },
                cookie_needed = false,
                entropy = new Random().Next(1000000000, int.MaxValue)
            };
            
            return Ok(info);
        }

        [HttpGet("{server}/{session}/eventsource")]
        public IActionResult EventSource(string server, string session)
        {
            return NotFound();
        }

        [HttpGet("{server}/{session}/xhr_streaming")]
        public IActionResult XhrStreaming(string server, string session)
        {
            return NotFound();
        }

        [HttpGet("iframe.html")]
        public IActionResult IFrame()
        {
            return NotFound();
        }

        [HttpGet("{server}/{session}/xhr")]
        public IActionResult Xhr(string server, string session)
        {
            return NotFound();
        }

        [HttpPost("{server}/{session}/xhr")]
        public IActionResult XhrPost(string server, string session)
        {
            return NotFound();
        }

        [HttpPost("{server}/{session}/xhr_send")]
        public IActionResult XhrSend(string server, string session)
        {
            return NotFound();
        }

        [HttpGet("iframe.html#{hash}")]
        public IActionResult IFrameWithHash(string hash)
        {
            return NotFound();
        }
    }
}