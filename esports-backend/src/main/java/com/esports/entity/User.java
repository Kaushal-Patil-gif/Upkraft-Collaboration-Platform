package com.esports.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Pattern(regexp = "^[a-zA-Z]+(\s[a-zA-Z]+)?$", message = "Name must contain only alphabets and at most one space")
    private String name;

    @NotBlank(message = "Email is required")
    @Pattern(
    	    regexp = "^[a-zA-Z0-9._%+-]+@(gmail\\.com|admin\\.com)$",
    	    message = "Email must be from gmail.com domain"
    	)
    @Column(unique = true)
    private String email;

    @Pattern(
    	    regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{6,}$",
    	    message = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    	)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.CREATOR;

    @Column(name = "google_id")
    private String googleId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "active")
    private boolean active = true;

    @Column(name = "has_selected_role")
    private boolean hasSelectedRole = false;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserProfile profile;
    
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserVerification verification;

    public enum Role {
        CREATOR, FREELANCER, ADMIN
    }

    public User(String name, String email, String password, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public UserVerification.VerificationLevel getVerificationLevel() {
        return verification != null ? verification.getVerificationLevel() : UserVerification.VerificationLevel.UNVERIFIED;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}