using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Upkart1.Filters
{
    public class FileUploadOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var fileParameters = context.MethodInfo.GetParameters()
                .Where(p => p.ParameterType == typeof(IFormFile) || p.ParameterType.Name == "IFormFile")
                .ToList();

            if (fileParameters.Any())
            {
                operation.RequestBody = new OpenApiRequestBody
                {
                    Content = new Dictionary<string, OpenApiMediaType>
                    {
                        ["multipart/form-data"] = new OpenApiMediaType
                        {
                            Schema = new OpenApiSchema
                            {
                                Type = "object",
                                Properties = new Dictionary<string, OpenApiSchema>()
                            }
                        }
                    }
                };

                foreach (var parameter in context.MethodInfo.GetParameters())
                {
                    if (parameter.ParameterType == typeof(IFormFile) || parameter.ParameterType.Name == "IFormFile")
                    {
                        operation.RequestBody.Content["multipart/form-data"].Schema.Properties[parameter.Name] = new OpenApiSchema
                        {
                            Type = "string",
                            Format = "binary"
                        };
                    }
                    else if (parameter.GetCustomAttributes(typeof(Microsoft.AspNetCore.Mvc.FromFormAttribute), false).Any())
                    {
                        operation.RequestBody.Content["multipart/form-data"].Schema.Properties[parameter.Name] = new OpenApiSchema
                        {
                            Type = GetOpenApiType(parameter.ParameterType)
                        };
                    }
                }
            }
        }

        private string GetOpenApiType(Type type)
        {
            if (type == typeof(string)) return "string";
            if (type == typeof(int) || type == typeof(long)) return "integer";
            if (type == typeof(double) || type == typeof(float)) return "number";
            if (type == typeof(bool)) return "boolean";
            return "string";
        }
    }
}