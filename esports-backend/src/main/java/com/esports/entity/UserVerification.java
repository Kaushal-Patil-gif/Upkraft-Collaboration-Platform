package com.esports.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_verifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserVerification {
    @Id
    private Long userId;
    
    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private VerificationLevel verificationLevel = VerificationLevel.UNVERIFIED;

    private String otpCode;
    private LocalDateTime otpExpiry;
    private boolean emailVerified = false;
    
    private String documentUrl;
    private String documentType;
    private LocalDateTime documentUploadedAt;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private DocumentStatus documentStatus;
    
    private String adminRemarks;
    private LocalDateTime reviewedAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum VerificationLevel {
        UNVERIFIED, LEVEL_1_EMAIL, LEVEL_2_DOCUMENT
    }
    
    public enum DocumentStatus {
        PENDING, APPROVED, REJECTED
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}