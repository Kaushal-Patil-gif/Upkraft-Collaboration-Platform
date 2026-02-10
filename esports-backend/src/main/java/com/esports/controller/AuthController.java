package com.esports.controller;

import com.esports.dto.*;
import com.esports.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@Valid @RequestBody GoogleAuthRequest request) {
        try {
            AuthResponse response = userService.googleAuth(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(ApiResponse.error("Google authentication failed"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Authentication failed"));
        }
    }

    @PostMapping("/update-role")
    public ResponseEntity<?> updateRole(@Valid @RequestBody UpdateRoleRequest request) {
        try {
            AuthResponse response = userService.updateUserRole(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponse.error("Failed to update role"));
        }
    }
}