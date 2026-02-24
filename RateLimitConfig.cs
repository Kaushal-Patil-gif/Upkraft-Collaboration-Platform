using System.Collections.Concurrent;

namespace Upkart.Api.Configuration;

public class RateLimitConfig : IDisposable
{
    private readonly ConcurrentDictionary<string, RateLimitEntry> _rateLimits = new();
    private readonly Timer _cleanupTimer;
    
    public RateLimitConfig()
    {
        _cleanupTimer = new Timer(CleanupExpiredEntries, null, TimeSpan.FromMinutes(5), TimeSpan.FromMinutes(5));
    }
    
    public bool IsAllowed(string key)
    {
        var now = DateTime.Now;
        var entry = _rateLimits.GetOrAdd(key, _ => new RateLimitEntry());
        
        lock (entry)
        {
            // Reset counter if window has passed (1 minute window)
            if ((now - entry.WindowStart).TotalMinutes >= 1)
            {
                entry.RequestCount = 0;
                entry.WindowStart = now;
            }
            
            entry.LastAccessed = now;
            
            // Allow up to 5 requests per minute
            if (entry.RequestCount < 5)
            {
                entry.RequestCount++;
                return true;
            }
            
            return false;
        }
    }
    
    private void CleanupExpiredEntries(object? state)
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
    
    public void Dispose()
    {
        _cleanupTimer?.Dispose();
    }
    
    public static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<RateLimitConfig>();
    }
    
    private class RateLimitEntry
    {
        public volatile int RequestCount = 0;
        public volatile DateTime WindowStart = DateTime.Now;
        public volatile DateTime LastAccessed = DateTime.Now;
    }
}