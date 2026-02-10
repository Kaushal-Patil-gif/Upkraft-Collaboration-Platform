package com.esports.controller;

import com.esports.dto.ApiResponse;
import com.esports.dto.UserProfileUpdateDTO;
import com.esports.dto.UserResponseDTO;
import com.esports.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            UserResponseDTO user = userService.getCurrentUser(authentication.getName());
            return ResponseEntity.ok(user);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("User not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to get user data"));
        }
    }
    
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UserProfileUpdateDTO profileData, Authentication authentication) {
        try {
            UserResponseDTO updatedUser = userService.updateUserProfile(authentication.getName(), profileData);
            return ResponseEntity.ok(updatedUser);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("User not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to update profile"));
        }
    }
}