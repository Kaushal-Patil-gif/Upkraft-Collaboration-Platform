package com.esports.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallet_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WalletTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "wallet_id")
    private Wallet wallet;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(name = "amount")
    private Double amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private TransactionStatus status;

    @Column(name = "razorpay_payment_id")
    private String razorpayPaymentId;
    
    @Column(name = "bank_account")
    private String bankAccount;
    
    @Column(name = "ifsc_code")
    private String ifscCode;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum TransactionType {
        ESCROW_HOLD, ESCROW_RELEASE, PAYMENT_RECEIVED, WITHDRAWAL, MILESTONE_PAYMENT
    }

    public enum TransactionStatus {
        PENDING, COMPLETED, FAILED
    }
}