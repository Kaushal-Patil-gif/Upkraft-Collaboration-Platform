package com.esports.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.validator.constraints.URL;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
    
    @Pattern(regexp = "^(\\S+\\s+){0,29}\\S*$", message = "Bio must not exceed 30 words")
    private String bio;
    
    private String location;
    
    @URL(message = "Website must be a valid URL")
    private String website;
    
    @Pattern(regexp = "^(\\S+\\s+){0,29}\\S*$", message = "Skills must not exceed 30 words")
    private String skills;
    
    @Column(name = "professional_name")
    private String professionalName;
    
    @Column(name = "channel_name")
    private String channelName;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Long getUserId() { 
        return user != null ? user.getId() : null; 
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}