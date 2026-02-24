using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections.Concurrent;
using Upkart1.DTO;

namespace Upkart1.Filters
{
    public class RateLimitFilter : IActionFilter
    {
        private static readonly ConcurrentDictionary<string, RateLimitEntry> _rateLimits = new();
        private static readonly Timer _cleanupTimer = new(CleanupExpiredEntries, null, TimeSpan.FromMinutes(5), TimeSpan.FromMinutes(5));
        
        public void OnActionExecuting(ActionExecutingContext context)
        {
            var clientIp = context.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var endpoint = context.HttpContext.Request.Path.ToString();
            var key = $"{clientIp}:{endpoint}";
            
            if (!IsAllowed(key))
            {
                var response = ApiResponse<object>.ErrorResponse("Rate limit exceeded. Please try again later.");
                context.Result = new ObjectResult(response)
                {
                    StatusCode = StatusCodes.Status429TooManyRequests
                };
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            // No implementation needed
        }

        private static bool IsAllowed(string key)
        {
            var now = DateTime.Now;
            var entry = _rateLimits.GetOrAdd(key, _ => new RateLimitEntry());

            lock (entry)
            {
                if ((now - entry.WindowStart).TotalMinutes >= 1)
                {
                    entry.RequestCount = 0;
                    entry.WindowStart = now;
                }

                entry.LastAccessed = now;

                if (entry.RequestCount < 5)
                {
                    entry.RequestCount++;
                    return true;
                }

                return false;
            }
        }

        private static void CleanupExpiredEntries(object? state)
        {
            var cutoff = DateTime.Now.AddMinutes(-10);
            var keysToRemove = _rateLimits
                .Where(kvp => kvp.Value.LastAccessed < cutoff)
                .Select(kvp => kvp.Key)
                .ToList();

            foreach (var key in keysToRemove)
            {
                _rateLimits.TryRemove(key, out _);
            }
        }

        private class RateLimitEntry
        {
            public int RequestCount { get; set; } = 0;
            public DateTime WindowStart { get; set; } = DateTime.Now;
            public DateTime LastAccessed { get; set; } = DateTime.Now;
        }
    }
}