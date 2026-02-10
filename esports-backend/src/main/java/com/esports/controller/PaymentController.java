package com.esports.controller;

import com.esports.dto.ApiResponse;
import com.esports.dto.PaymentHistoryDTO;
import com.esports.entity.MilestonePayment;
import com.esports.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory(Authentication auth) {
        try {
            List<PaymentHistoryDTO> history = paymentService.getPaymentHistory(auth.getName());
            return ResponseEntity.ok(history);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("User not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to get payment history"));
        }
    }

    @GetMapping("/invoice/{projectId}")
    public ResponseEntity<?> generateInvoice(@PathVariable Long projectId, Authentication auth) {
        try {
            Map<String, Object> invoice = paymentService.generateInvoice(auth.getName(), projectId);
            return ResponseEntity.ok(invoice);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("Project not found"));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to generate invoice"));
        }
    }
    
    @PostMapping("/milestone/{projectId}/release")
    @PreAuthorize("hasRole('CREATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> releaseMilestonePayment(@PathVariable Long projectId, @RequestBody Map<String, Object> data, Authentication auth) {
        try {
            Map<String, Object> result = paymentService.releaseMilestonePayment(auth.getName(), projectId, data);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("Project not found"));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to release milestone payment"));
        }
    }
    
    @GetMapping("/milestones/{projectId}")
    public ResponseEntity<?> getMilestonePayments(@PathVariable Long projectId, Authentication auth) {
        try {
            List<MilestonePayment> milestones = paymentService.getMilestonePayments(auth.getName(), projectId);
            return ResponseEntity.ok(milestones);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("Project not found"));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to get milestone payments"));
        }
    }
}