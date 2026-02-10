package com.esports.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "projects")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Pattern(regexp = "^[a-zA-Z\s]+$", message = "Title must contain only alphabets and spaces")
    @Size(max = 20, message = "Title must not exceed 20 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 300, message = "Description must not exceed 300 characters")
    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    @JsonIgnoreProperties({"password", "profile", "verification", "hibernateLazyInitializer", "handler"})
    private User creator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id")
    @JsonIgnoreProperties({"password", "profile", "verification", "hibernateLazyInitializer", "handler"})
    private User freelancer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    @JsonIgnoreProperties({"freelancer", "hibernateLazyInitializer", "handler"})
    private Service service;

    @NotNull
    private Double price;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private ProjectStatus status = ProjectStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EscrowStatus escrowStatus = EscrowStatus.PENDING;

    private String paymentId;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Future(message = "Deadline must be in the future")
    @Column(name = "deadline")
    private LocalDateTime deadline;

    @ElementCollection
    @CollectionTable(name = "project_milestones")
    private List<String> milestones;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum ProjectStatus {
        PENDING, IN_PROGRESS, IN_REVIEW, COMPLETED, CANCELLED
    }

    public enum PaymentStatus {
        PENDING, COMPLETED, REFUNDED
    }

    public enum EscrowStatus {
        PENDING, HELD, RELEASED
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}