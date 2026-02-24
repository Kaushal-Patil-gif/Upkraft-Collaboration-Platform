namespace Upkart1.Services
{
    public interface IEmailService
    {
        void SendOTP(string to, string otp);
        void SendProjectNotification(string to, string subject, string message);
        Task SendProjectNotificationAsync(string to, string subject, string message);
    }
}
