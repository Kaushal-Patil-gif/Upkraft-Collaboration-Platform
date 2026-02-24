using Microsoft.AspNetCore.Mvc;
using Upkart1.DTO;
using Upkart1.Services;

namespace Upkart1.Controllers
{
    [ApiController]
    [Route("api/contact")]
    public class ContactController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public ContactController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> SendContactMessage([FromBody] Dictionary<string, string> contactData)
        {
            try
            {
                var name = contactData.GetValueOrDefault("name");
                var email = contactData.GetValueOrDefault("email");
                var subject = contactData.GetValueOrDefault("subject");
                var message = contactData.GetValueOrDefault("message");

                if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(email) || 
                    string.IsNullOrEmpty(subject) || string.IsNullOrEmpty(message))
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse("All fields are required"));
                }

                // Send email to admin
                var emailContent = $@"Attention, New Contact Form Recieved:

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}";

                await _emailService.SendProjectNotificationAsync(
                    "upkraft.connect@gmail.com",
                    $"Contact Form: {subject}",
                    emailContent
                );

                return Ok(ApiResponse<object>.SuccessResponse("Message sent successfully"));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Failed to send message"));
            }
        }
    }
}
