package com.esports.controller;

import com.esports.dto.*;
import com.esports.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponseDTO> getAdminStats() {
        try {
            AdminStatsResponseDTO stats = adminService.getAdminStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/kyc/pending")
    public ResponseEntity<List<KycDocumentResponseDTO>> getPendingKYCDocuments() {
        try {
            List<KycDocumentResponseDTO> documents = adminService.getPendingKycDocuments();
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/kyc/review")
    public ResponseEntity<ApiResponse<String>> reviewKYCDocument(@RequestBody KycReviewRequestDTO request) {
        try {
            adminService.reviewKycDocument(request);
            return ResponseEntity.ok(ApiResponse.success("Document " + request.getAction() + "d successfully"));
        } catch (NumberFormatException e) {
            return ResponseEntity.status(400).body(ApiResponse.error("Invalid request format"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("Verification not found"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to review document"));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponseDTO>> getAllUsers() {
        try {
            List<AdminUserResponseDTO> users = adminService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/users/{userId}/deactivate")
    public ResponseEntity<ApiResponse<String>> deactivateUser(@PathVariable Long userId) {
        try {
            adminService.deactivateUser(userId);
            return ResponseEntity.ok(ApiResponse.success("User deactivated successfully"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("User not found"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to deactivate user"));
        }
    }

    @PutMapping("/users/{userId}/activate")
    public ResponseEntity<ApiResponse<String>> activateUser(@PathVariable Long userId) {
        try {
            adminService.activateUser(userId);
            return ResponseEntity.ok(ApiResponse.success("User activated successfully"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("User not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to activate user"));
        }
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<String>> updateUser(@PathVariable Long userId, @Valid @RequestBody UserUpdateRequestDTO request) {
        try {
            adminService.updateUser(userId, request);
            return ResponseEntity.ok(ApiResponse.success("User updated successfully"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("User not found"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to update user"));
        }
    }

    @PutMapping("/users/{userId}/kyc-status")
    public ResponseEntity<ApiResponse<String>> updateUserKycStatus(@PathVariable Long userId, @RequestBody KycStatusUpdateDTO request) {
        try {
            adminService.updateUserKycStatus(userId, request.getKycStatus());
            return ResponseEntity.ok(ApiResponse.success("KYC status updated successfully"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("User not found"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to update KYC status"));
        }
    }

    @GetMapping("/users/{userId}/documents")
    public ResponseEntity<List<UserDocumentResponseDTO>> getUserDocuments(@PathVariable Long userId) {
        try {
            List<UserDocumentResponseDTO> documents = adminService.getUserDocuments(userId);
            return ResponseEntity.ok(documents);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}