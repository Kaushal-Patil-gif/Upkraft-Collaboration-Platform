using System.Text.Json;
using System.Security;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Upkart1.DTO;
using Upkart1.Exceptions;

namespace Upkart1.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            
            // Debug logging matching Spring backend
            Console.WriteLine($"{exception.GetType().Name}: {exception.Message}");
            
            var response = CreateErrorResponse(exception);
            var statusCode = GetStatusCode(exception);
            
            context.Response.StatusCode = statusCode;

            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            return context.Response.WriteAsync(json);
        }
        
        private static object CreateErrorResponse(Exception exception)
        {
            return exception switch
            {
                Upkart1.Exceptions.ValidationException validationEx => HandleValidationException(validationEx),
                ResourceNotFoundException notFoundEx => ApiResponse<object>.ErrorResponse(notFoundEx.Message),
                BusinessLogicException businessEx => ApiResponse<object>.ErrorResponse(businessEx.Message),
                AuthenticationException authEx => ApiResponse<object>.ErrorResponse(authEx.Message),
                AuthorizationException authzEx => ApiResponse<object>.ErrorResponse(authzEx.Message),
                PaymentException paymentEx => ApiResponse<object>.ErrorResponse(paymentEx.Message),
                FileUploadException fileEx => ApiResponse<object>.ErrorResponse(fileEx.Message),
                EmailException emailEx => ApiResponse<object>.ErrorResponse(emailEx.Message),
                RateLimitExceededException rateLimitEx => ApiResponse<object>.ErrorResponse(rateLimitEx.Message),
                ArgumentException argEx => ApiResponse<object>.ErrorResponse(argEx.Message),
                InvalidOperationException invalidEx => ApiResponse<object>.ErrorResponse(invalidEx.Message),
                KeyNotFoundException => ApiResponse<object>.ErrorResponse("Resource not found"),
                FileNotFoundException => ApiResponse<object>.ErrorResponse("Resource not found"),
                UnauthorizedAccessException => ApiResponse<object>.ErrorResponse("Access denied"),
                SecurityException => ApiResponse<object>.ErrorResponse("Access denied"),
                _ => HandleGenericException(exception)
            };
        }
        
        private static int GetStatusCode(Exception exception)
        {
            return exception switch
            {
                Upkart1.Exceptions.ValidationException => StatusCodes.Status400BadRequest,
                ResourceNotFoundException => StatusCodes.Status404NotFound,
                BusinessLogicException => StatusCodes.Status400BadRequest,
                AuthenticationException => StatusCodes.Status401Unauthorized,
                AuthorizationException => StatusCodes.Status403Forbidden,
                PaymentException => StatusCodes.Status402PaymentRequired,
                FileUploadException => StatusCodes.Status400BadRequest,
                EmailException => StatusCodes.Status500InternalServerError,
                RateLimitExceededException => StatusCodes.Status429TooManyRequests,
                ArgumentException => StatusCodes.Status400BadRequest,
                InvalidOperationException => StatusCodes.Status400BadRequest,
                KeyNotFoundException => StatusCodes.Status404NotFound,
                FileNotFoundException => StatusCodes.Status404NotFound,
                UnauthorizedAccessException => StatusCodes.Status403Forbidden,
                SecurityException => StatusCodes.Status403Forbidden,
                _ => StatusCodes.Status500InternalServerError
            };
        }
        
        private static object HandleValidationException(Upkart1.Exceptions.ValidationException ex)
        {
            // Handle validation errors similar to Spring MethodArgumentNotValidException
            var errors = new Dictionary<string, string>();
            
            if (ex.ValidationErrors.Count > 0)
            {
                errors = ex.ValidationErrors;
            }
            else if (ex.Data.Count > 0)
            {
                foreach (var key in ex.Data.Keys)
                {
                    errors[key.ToString() ?? "field"] = ex.Data[key]?.ToString() ?? "Validation error";
                }
            }
            else
            {
                errors["validation"] = ex.Message;
            }
            
            Console.WriteLine($"Validation errors: {JsonSerializer.Serialize(errors)}");
            return ApiResponse<object>.ErrorResponse("Validation failed", errors);
        }
        
        private static object HandleGenericException(Exception ex)
        {
            Console.WriteLine($"Generic exception: {ex.GetType().Name} - {ex.Message}");
            Console.WriteLine(ex.StackTrace); // Full stack trace matching Spring
            return ApiResponse<object>.ErrorResponse("An unexpected error occurred");
        }
    }
}
