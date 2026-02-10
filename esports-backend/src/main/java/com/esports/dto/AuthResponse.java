package com.esports.dto;

import com.esports.entity.User;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private Long id;
    private String name;
    private String email;
    private int role;
    private String token;
    private LocalDateTime createdAt;
    private boolean hasSelectedRole;

    public AuthResponse(Long id, String name, String email, User.Role role, String token, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role.ordinal();
        this.token = token;
        this.createdAt = createdAt;
        this.hasSelectedRole = true;
    }

    public AuthResponse(Long id, String name, String email, User.Role role, String token, LocalDateTime createdAt, boolean hasSelectedRole) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role.ordinal();
        this.token = token;
        this.createdAt = createdAt;
        this.hasSelectedRole = hasSelectedRole;
    }
}