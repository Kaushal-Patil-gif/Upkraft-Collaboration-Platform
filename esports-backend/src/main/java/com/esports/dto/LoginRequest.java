package com.esports.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Email is required")
    @Pattern(
        regexp = "^[a-zA-Z0-9._%+-]+@(gmail\\.com|admin\\.com)$",
        message = "Email must be from gmail.com domain"
    )
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}