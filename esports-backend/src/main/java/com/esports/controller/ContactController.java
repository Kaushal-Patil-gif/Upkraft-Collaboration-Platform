package com.esports.controller;

import com.esports.dto.ApiResponse;
import com.esports.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:5173")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<?> sendContactMessage(@RequestBody Map<String, String> contactData) {
        try {
            String name = contactData.get("name");
            String email = contactData.get("email");
            String subject = contactData.get("subject");
            String message = contactData.get("message");

            if (name == null || email == null || subject == null || message == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("All fields are required"));
            }

            // Send email to admin
            String emailContent = String.format(
                "Attention, New Contact Form Recieved:\n\n" +
                "Name: %s\n" +
                "Email: %s\n" +
                "Subject: %s\n\n" +
                "Message:\n%s",
                name, email, subject, message
            );

            emailService.sendProjectNotification(
                "upkraft.connect@gmail.com",
                "Contact Form: " + subject,
                emailContent
            );

            return ResponseEntity.ok(ApiResponse.success("Message sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to send message"));
        }
    }
}