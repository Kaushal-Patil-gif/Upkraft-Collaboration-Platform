package com.esports.config;

import org.springframework.context.annotation.Configuration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Configuration
public class RateLimitConfig {
    
    private final ConcurrentHashMap<String, RateLimitEntry> rateLimits = new ConcurrentHashMap<>();
    private ScheduledExecutorService cleanupExecutor;
    
    @PostConstruct
    public void init() {
        cleanupExecutor = Executors.newSingleThreadScheduledExecutor();
        cleanupExecutor.scheduleAtFixedRate(this::cleanupExpiredEntries, 5, 5, TimeUnit.MINUTES);
    }
    
    @PreDestroy
    public void destroy() {
        if (cleanupExecutor != null) {
            cleanupExecutor.shutdown();
        }
    }
    
    public boolean isAllowed(String key) {
        LocalDateTime now = LocalDateTime.now();
        RateLimitEntry entry = rateLimits.computeIfAbsent(key, k -> new RateLimitEntry());
        
        // Resetting request counter if window has passed
        if (ChronoUnit.MINUTES.between(entry.windowStart, now) >= 1) {
            entry.requestCount = 0;
            entry.windowStart = now;
        }
        
        entry.lastAccessed = now;
        
        if (entry.requestCount < 5) {
            entry.requestCount++;
            return true;
        }
        
        return false;
    }
    
    private void cleanupExpiredEntries() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(10);
        rateLimits.entrySet().removeIf(entry -> entry.getValue().lastAccessed.isBefore(cutoff));
    }
    
    private static class RateLimitEntry {
        volatile int requestCount = 0;
        volatile LocalDateTime windowStart = LocalDateTime.now();
        volatile LocalDateTime lastAccessed = LocalDateTime.now();
    }
}