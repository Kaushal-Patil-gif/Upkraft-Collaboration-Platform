package com.esports.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequestDTO {
    @Pattern(regexp = "^[a-zA-Z]+(\s[a-zA-Z]+)?$", message = "Name must contain only alphabets and at most one space")
    private String name;
    
    @Email(message = "Email must be valid")
    private String email;
    
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}