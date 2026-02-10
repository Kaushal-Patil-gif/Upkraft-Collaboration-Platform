package com.esports.controller;

import com.esports.dto.DashboardResponse;
import com.esports.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/creator")
    @PreAuthorize("hasRole('CREATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getCreatorDashboard(Authentication auth) {
        try {
            DashboardResponse response = dashboardService.getCreatorDashboard(auth.getName());
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to get creator dashboard"));
        }
    }

    @GetMapping("/freelancer")
    @PreAuthorize("hasRole('FREELANCER') or hasRole('ADMIN')")
    public ResponseEntity<?> getFreelancerDashboard(Authentication auth) {
        try {
            DashboardResponse response = dashboardService.getFreelancerDashboard(auth.getName());
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to get freelancer dashboard"));
        }
    }
}