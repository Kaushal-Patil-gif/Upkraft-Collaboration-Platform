using Upkart1.DTO;
using Upkart1.Entities;

namespace Upkart1.Services
{
    public interface IPaymentService
    {
        List<PaymentHistoryDTO> GetPaymentHistory(string email);
        Dictionary<string, object> GenerateInvoice(string email, long projectId);
        Dictionary<string, object> ReleaseMilestonePayment(string email, long projectId, Dictionary<string, object> data);
        List<MilestonePayment> GetMilestonePayments(string email, long projectId);
    }
}
