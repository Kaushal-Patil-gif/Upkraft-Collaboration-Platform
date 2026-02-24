using System.Collections.Concurrent;

namespace Upkart1.Configuration
{
    public class RateLimitConfig
    {
        private readonly ConcurrentDictionary<string, RateLimitEntry> _rateLimits = new();
        private readonly Timer _cleanupTimer;

        public RateLimitConfig()
        {
            _cleanupTimer = new Timer(CleanupExpiredEntries, null, TimeSpan.FromMinutes(5), TimeSpan.FromMinutes(5));
        }

        public static void Configure()
        {
            // Rate limit configuration placeholder
        }

        public bool IsAllowed(string key)
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

        private class RateLimitEntry
        {
            public int RequestCount { get; set; } = 0;
            public DateTime WindowStart { get; set; } = DateTime.Now;
            public DateTime LastAccessed { get; set; } = DateTime.Now;
        }
    }
}