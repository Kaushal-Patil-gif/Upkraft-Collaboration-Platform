using Microsoft.AspNetCore.Mvc;
using Upkart1.DTO;
using Upkart1.Services;

namespace Upkart1.Controllers
{
    [ApiController]
    [Route("api")]
    public class MarketplaceController : ControllerBase
    {
        private readonly IMarketplaceService _marketplaceService;

        public MarketplaceController(IMarketplaceService marketplaceService)
        {
            _marketplaceService = marketplaceService;
        }

        [HttpGet("services")]
        public IActionResult GetAllServices()
        {
            try
            {
                var services = _marketplaceService.GetAllActiveServices();
                return Ok(services);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Failed to get services" });
            }
        }
    }
}
