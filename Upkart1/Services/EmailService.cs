using System.Net;
using System.Net.Mail;

namespace Upkart1.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public void SendOTP(string to, string otp)
        {
            try
            {
                var smtp = new SmtpClient(
                    _config["Email:Host"],
                    int.Parse(_config["Email:Port"]))
                {
                    Credentials = new NetworkCredential(
                        _config["Email:Username"],
                        _config["Email:Password"]
                    ),
                    EnableSsl = bool.Parse(_config["Email:EnableSsl"])
                };

                var mail = new MailMessage
                {
                    From = new MailAddress("upkraft.connect@gmail.com"),
                    Subject = "Upkraft - Email Verification OTP",
                    Body = $"Your OTP for email verification is: {otp}\nThis OTP will expire in 10 minutes.",
                    IsBodyHtml = false
                };

                mail.To.Add(to);
                smtp.Send(mail);
            }
            catch (Exception e)
            {
                throw new Exception($"Failed to send OTP email: {e.Message}");
            }
        }

        public void SendProjectNotification(string to, string subject, string message)
        {
            try
            {
                var smtp = new SmtpClient(
                    _config["Email:Host"],
                    int.Parse(_config["Email:Port"]))
                {
                    Credentials = new NetworkCredential(
                        _config["Email:Username"],
                        _config["Email:Password"]
                    ),
                    EnableSsl = bool.Parse(_config["Email:EnableSsl"])
                };

                var mail = new MailMessage
                {
                    From = new MailAddress("upkraft.connect@gmail.com"),
                    Subject = subject,
                    Body = message,
                    IsBodyHtml = false
                };

                mail.To.Add(to);
                smtp.Send(mail);
            }
            catch (Exception e)
            {
                Console.WriteLine($"Failed to send notification email: {e.Message}");
            }
        }

        public async Task SendProjectNotificationAsync(string to, string subject, string message)
        {
            try
            {
                var smtp = new SmtpClient(
                    _config["Email:Host"],
                    int.Parse(_config["Email:Port"]))
                {
                    Credentials = new NetworkCredential(
                        _config["Email:Username"],
                        _config["Email:Password"]
                    ),
                    EnableSsl = bool.Parse(_config["Email:EnableSsl"])
                };

                var mail = new MailMessage
                {
                    From = new MailAddress("upkraft.connect@gmail.com"),
                    Subject = subject,
                    Body = message,
                    IsBodyHtml = false
                };

                mail.To.Add(to);
                await smtp.SendMailAsync(mail);
            }
            catch (Exception e)
            {
                Console.WriteLine($"Failed to send notification email: {e.Message}");
            }
        }
    }
}
