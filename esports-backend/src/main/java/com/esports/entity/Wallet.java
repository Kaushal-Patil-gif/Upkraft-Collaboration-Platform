package com.esports.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "available_balance", nullable = false)
    private Double availableBalance = 0.0;

    @Column(name = "escrow_balance", nullable = false)
    private Double escrowBalance = 0.0;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Null-safe balance operations
    public void addToAvailableBalance(Double amount) {
        if (amount != null && amount > 0) {
            this.availableBalance = (this.availableBalance != null ? this.availableBalance : 0.0) + amount;
        }
    }

    public void subtractFromAvailableBalance(Double amount) {
        if (amount != null && amount > 0) {
            this.availableBalance = Math.max(0.0, (this.availableBalance != null ? this.availableBalance : 0.0) - amount);
        }
    }

    public void addToEscrowBalance(Double amount) {
        if (amount != null && amount > 0) {
            this.escrowBalance = (this.escrowBalance != null ? this.escrowBalance : 0.0) + amount;
        }
    }

    public void subtractFromEscrowBalance(Double amount) {
        if (amount != null && amount > 0) {
            this.escrowBalance = Math.max(0.0, (this.escrowBalance != null ? this.escrowBalance : 0.0) - amount);
        }
    }
}