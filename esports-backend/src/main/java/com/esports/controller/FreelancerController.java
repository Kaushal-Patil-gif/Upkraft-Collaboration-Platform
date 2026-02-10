package com.esports.controller;

import com.esports.entity.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/freelancer")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('FREELANCER') or hasRole('ADMIN')")
public class FreelancerController {

    @Autowired
    private FreelancerService freelancerService;

    @PostMapping(value = "/services", consumes = "multipart/form-data")
    public ResponseEntity<?> createService(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("deliveryTime") Integer deliveryTime,
            @RequestParam("category") String category,
            @RequestParam("active") Boolean active,
            @RequestParam(value = "photo1", required = false) MultipartFile photo1,
            @RequestParam(value = "photo2", required = false) MultipartFile photo2,
            @RequestParam(value = "photo3", required = false) MultipartFile photo3,
            Authentication auth) {

        try {
            Service service = freelancerService.createService(
                auth.getName(), title, description, price, deliveryTime,
                category, active, photo1, photo2, photo3
            );
            return ResponseEntity.ok(service);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Service creation failed"));
        }
    }

    @GetMapping("/services")
    public ResponseEntity<?> getFreelancerServices(Authentication auth) {
        try {
            List<ServiceResponse> services = freelancerService.getFreelancerServices(auth.getName());
            return ResponseEntity.ok(services);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch services"));
        }
    }

    @PutMapping(value = "/services/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateService(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("deliveryTime") Integer deliveryTime,
            @RequestParam("category") String category,
            @RequestParam("active") Boolean active,
            @RequestParam(value = "photo1", required = false) MultipartFile photo1,
            @RequestParam(value = "photo2", required = false) MultipartFile photo2,
            @RequestParam(value = "photo3", required = false) MultipartFile photo3,
            Authentication auth) {

        try {
            Service service = freelancerService.updateService(
                auth.getName(), id, title, description, price, deliveryTime,
                category, active, photo1, photo2, photo3
            );
            return ResponseEntity.ok(Map.of(
                "message", "Service updated successfully",
                "service", service
            ));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Service or user not found"));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("error", "Unauthorized"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update service"));
        }
    }

    @GetMapping("/services/{id}")
    public ResponseEntity<?> getService(@PathVariable Long id) {
        try {
            Service service = freelancerService.getService(id);
            return ResponseEntity.ok(service);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Service not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch service"));
        }
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id, Authentication auth) {
        try {
            freelancerService.deleteService(auth.getName(), id);
            return ResponseEntity.ok(Map.of("message", "Service deleted successfully"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Service or user not found"));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("error", "Unauthorized"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to delete service"));
        }
    }
}