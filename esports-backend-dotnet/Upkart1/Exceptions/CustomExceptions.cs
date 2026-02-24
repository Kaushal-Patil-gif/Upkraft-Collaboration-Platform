using System.ComponentModel.DataAnnotations;

namespace Upkart1.Exceptions
{
    // Custom exceptions matching Spring backend patterns
    
    public class ValidationException : Exception
    {
        public Dictionary<string, string> ValidationErrors { get; }
        
        public ValidationException(string message) : base(message)
        {
            ValidationErrors = new Dictionary<string, string>();
        }
        
        public ValidationException(string message, Dictionary<string, string> validationErrors) : base(message)
        {
            ValidationErrors = validationErrors;
            // Add errors to Data for middleware access
            foreach (var error in validationErrors)
            {
                Data[error.Key] = error.Value;
            }
        }
    }
    
    public class ResourceNotFoundException : Exception
    {
        public ResourceNotFoundException(string message) : base(message) { }
    }
    
    public class BusinessLogicException : Exception
    {
        public BusinessLogicException(string message) : base(message) { }
    }
    
    public class AuthenticationException : Exception
    {
        public AuthenticationException(string message) : base(message) { }
    }
    
    public class AuthorizationException : Exception
    {
        public AuthorizationException(string message) : base(message) { }
    }
    
    public class PaymentException : Exception
    {
        public PaymentException(string message) : base(message) { }
    }
    
    public class FileUploadException : Exception
    {
        public FileUploadException(string message) : base(message) { }
    }
    
    public class EmailException : Exception
    {
        public EmailException(string message) : base(message) { }
    }
    
    public class RateLimitExceededException : Exception
    {
        public RateLimitExceededException(string message) : base(message) { }
    }
}