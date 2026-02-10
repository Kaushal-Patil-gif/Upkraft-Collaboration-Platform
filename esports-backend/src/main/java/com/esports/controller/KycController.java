package com.esports.controller;

import com.esports.dto.ApiResponse;
import com.esports.dto.KycStatusResponseDTO;
import com.esports.service.KycService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/kyc")
@CrossOrigin(origins = "http://localhost:5173")
public class KycController {

    @Autowired
    private KycService kycService;

   

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOTP(Authentication auth) {
        try {
            kycService.sendOTP(auth.getName());
            return ResponseEntity.ok(ApiResponse.success("OTP sent successfully"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("User not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to send OTP"));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> request, Authentication auth) {
        try {
            String otp = request.get("otp");
            kycService.verifyOTP(auth.getName(), otp);
            return ResponseEntity.ok(ApiResponse.success("Email verified successfully", "LEVEL_1_EMAIL"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("User not found"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Verification failed"));
        }
    }

    @PostMapping("/upload-document")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType,
            Authentication auth) {
        try {
            String documentUrl = kycService.uploadDocument(auth.getName(), file, documentType);
            return ResponseEntity.ok(ApiResponse.success("Document uploaded successfully", documentUrl));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("User not found"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Document upload failed"));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getKYCStatus(Authentication auth) {
        try {
            KycStatusResponseDTO status = kycService.getKYCStatus(auth.getName());
            return ResponseEntity.ok(status);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("User not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to fetch KYC status"));
        }
    }
}