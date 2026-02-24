using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Upkart1.DTO;
using Upkart1.Exceptions;

namespace Upkart1.Filters
{
    public class ValidationFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                var errors = new Dictionary<string, string>();
                
                foreach (var modelError in context.ModelState)
                {
                    var fieldName = modelError.Key;
                    var errorMessage = modelError.Value.Errors.FirstOrDefault()?.ErrorMessage ?? "Invalid value";
                    
                    // Skip parameter-level errors and focus on property-level errors
                    if (fieldName.Contains("."))
                    {
                        // Extract property name from "projectData.PropertyName" format
                        var propertyName = fieldName.Substring(fieldName.LastIndexOf('.') + 1);
                        var camelCaseFieldName = char.ToLowerInvariant(propertyName[0]) + propertyName.Substring(1);
                        errors[camelCaseFieldName] = errorMessage;
                    }
                    else if (!fieldName.Equals("projectData", StringComparison.OrdinalIgnoreCase))
                    {
                        // Handle direct property names
                        var camelCaseFieldName = char.ToLowerInvariant(fieldName[0]) + fieldName.Substring(1);
                        errors[camelCaseFieldName] = errorMessage;
                    }
                }
                
                // Debug log matching Spring backend
                Console.WriteLine($"Validation errors: {System.Text.Json.JsonSerializer.Serialize(errors)}");
                
                var response = ApiResponse<object>.ErrorResponse("Validation failed", errors);
                context.Result = new BadRequestObjectResult(response);
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            // No implementation needed
        }
    }
}