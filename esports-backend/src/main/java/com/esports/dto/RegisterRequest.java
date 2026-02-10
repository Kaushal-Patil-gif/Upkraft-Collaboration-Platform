package com.esports.dto;

import com.esports.entity.User;
import com.esports.validation.PasswordMatches;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@PasswordMatches
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    @Pattern(regexp = "^[a-zA-Z]+(\\s[a-zA-Z]+)?$", message = "Name must contain only alphabets and at most one space")
    private String name;

    @NotBlank(message = "Email is required")
    @Pattern(
    	    regexp = "^[a-zA-Z0-9._%+-]+@(gmail\\.com|admin\\.com)$",
    	    message = "Email must be from gmail.com domain"
    	)
    private String email;

    @NotBlank(message = "Password is required")
    @Pattern(
    	    regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{6,}$",
    	    message = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    	)
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(CREATOR|FREELANCER)$", message = "Role must be either CREATOR or FREELANCER")
    private String role;
}