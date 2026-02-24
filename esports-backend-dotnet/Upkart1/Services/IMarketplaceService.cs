using Upkart1.DTO;

namespace Upkart1.Services
{
    public interface IMarketplaceService
    {
        List<MarketplaceServiceDTO> GetAllActiveServices();
    }
}
