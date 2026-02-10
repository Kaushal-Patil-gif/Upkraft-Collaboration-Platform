package com.esports.controller;

import com.esports.dto.ApiResponse;
import com.esports.dto.WalletResponseDTO;
import com.esports.dto.WithdrawalRequestDTO;
import com.esports.entity.WalletTransaction;
import com.esports.service.WalletService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "http://localhost:5173")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @PostMapping("/escrow/hold")
    public ResponseEntity<?> holdEscrow(@RequestBody Map<String, Object> request, Authentication auth) {
        try {
            Long projectId = Long.valueOf(request.get("projectId").toString());
            String razorpayPaymentId = (String) request.get("razorpayPaymentId");
            
            Map<String, Object> result = walletService.holdEscrow(auth.getName(), projectId, razorpayPaymentId);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("Project not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to hold escrow"));
        }
    }

    @PostMapping("/escrow/release/{projectId}")
    @PreAuthorize("hasRole('CREATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> releaseEscrow(@PathVariable Long projectId, Authentication auth) {
        try {
            Map<String, Object> result = walletService.releaseEscrow(auth.getName(), projectId);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("Project or wallet not found"));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to release escrow"));
        }
    }

    @GetMapping("/balance")
    public ResponseEntity<?> getWalletBalance(Authentication auth) {
        try {
            WalletResponseDTO balance = walletService.getWalletBalance(auth.getName());
            return ResponseEntity.ok(balance);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("User not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to get wallet balance"));
        }
    }
    
    @PostMapping("/withdraw/request")
    @PreAuthorize("hasRole('FREELANCER') or hasRole('ADMIN')")
    public ResponseEntity<?> requestWithdrawal(@RequestBody WithdrawalRequestDTO request, Authentication auth) {
        try {
            Map<String, Object> result = walletService.requestWithdrawal(auth.getName(), request);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("User or wallet not found"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to request withdrawal"));
        }
    }
    
    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions(Authentication auth) {
        try {
            List<WalletTransaction> transactions = walletService.getTransactions(auth.getName());
            return ResponseEntity.ok(transactions);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("User not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to get transactions"));
        }
    }
}