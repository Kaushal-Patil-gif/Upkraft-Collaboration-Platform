package com.esports.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateRoleRequest {
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotBlank(message = "Role is required")
    private String role;
}