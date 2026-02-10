package com.esports.service;

import com.esports.dto.*;
import com.esports.entity.User;
import com.esports.entity.UserVerification;
import com.esports.entity.Project;
import com.esports.repository.UserRepository;
import com.esports.repository.UserVerificationRepository;
import com.esports.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserVerificationRepository userVerificationRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private S3Service s3Service;

    public AdminStatsResponseDTO getAdminStats() {
        long totalUsers = userRepository.count();
        long activeProjects = projectRepository.countByStatus(Project.ProjectStatus.IN_PROGRESS);
        long pendingKyc = userVerificationRepository.countByDocumentStatus(UserVerification.DocumentStatus.PENDING);
        
        Double totalProjectValue = projectRepository.sumPriceByPaymentStatus(Project.PaymentStatus.COMPLETED);
        if (totalProjectValue == null) totalProjectValue = 0.0;
        
        Double platformRevenue = totalProjectValue * 0.30;
        Double freelancerEarnings = totalProjectValue - platformRevenue;
        
        return new AdminStatsResponseDTO(
            totalUsers, activeProjects, pendingKyc, 
            totalProjectValue, platformRevenue, freelancerEarnings, 30.0
        );
    }

    public List<KycDocumentResponseDTO> getPendingKycDocuments() {
        List<UserVerification> pendingDocs = userVerificationRepository
            .findByDocumentStatus(UserVerification.DocumentStatus.PENDING);

        return pendingDocs.stream().map(verification -> {
            String documentUrl = "";
            try {
                if (verification.getDocumentUrl() != null) {
                    documentUrl = s3Service.generateDownloadUrl(extractS3Key(verification.getDocumentUrl()));
                }
            } catch (Exception e) {
                // Ignore failure and continue with empty or without URL
            }

            return new KycDocumentResponseDTO(
                verification.getUser().getId(),
                verification.getUser().getName(),
                verification.getUser().getEmail(),
                verification.getDocumentType() != null ? verification.getDocumentType() : "",
                documentUrl,
                verification.getDocumentUploadedAt() != null ? verification.getDocumentUploadedAt().toString() : "",
                verification.getDocumentStatus().toString()
            );
        }).collect(Collectors.toList());
    }

    @Transactional
    public void reviewKycDocument(KycReviewRequestDTO request) {
        if (!"approve".equals(request.getAction()) && !"reject".equals(request.getAction())) {
            throw new IllegalArgumentException("Invalid action. Must be 'approve' or 'reject'");
        }
        
        UserVerification verification = userVerificationRepository.findById(request.getUserId())
            .orElseThrow(() -> new NoSuchElementException("Verification not found"));

        if ("approve".equals(request.getAction())) {
            verification.setDocumentStatus(UserVerification.DocumentStatus.APPROVED);
            verification.setVerificationLevel(UserVerification.VerificationLevel.LEVEL_2_DOCUMENT);
        } else {
            verification.setDocumentStatus(UserVerification.DocumentStatus.REJECTED);
        }

        verification.setAdminRemarks(request.getRemarks());
        verification.setReviewedAt(LocalDateTime.now());
        userVerificationRepository.save(verification);
    }

    public List<AdminUserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> {
            String kycStatus = "UNVERIFIED";
            if (user.getVerification() != null) {
                if (user.getVerification().getVerificationLevel() != null) {
                    kycStatus = user.getVerification().getVerificationLevel().toString();
                }
            }
            
            return new AdminUserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().toString(),
                kycStatus,
                user.isActive(),
                user.getCreatedAt()
            );
        }).collect(Collectors.toList());
    }

    public void deactivateUser(Long userId) {
        User userToDeactivate = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        if (userToDeactivate.getRole() == User.Role.ADMIN) {
            throw new IllegalArgumentException("Cannot deactivate admin accounts");
        }
        
        if (!userToDeactivate.isActive()) {
            throw new IllegalArgumentException("User is already deactivated");
        }

        userToDeactivate.setActive(false);
        userRepository.save(userToDeactivate);
    }

    public void activateUser(Long userId) {
        User userToActivate = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found"));

        userToActivate.setActive(true);
        userRepository.save(userToActivate);
    }

    @Transactional
    public void updateUser(Long userId, UserUpdateRequestDTO request) {
        User userToUpdate = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        // Email validation format and ensure it is not used by another user

        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            if (!isValidEmail(request.getEmail().trim())) {
                throw new IllegalArgumentException("Invalid email format");
            }
            // Check if email already exists for another user
            userRepository.findByEmail(request.getEmail().trim())
                .ifPresent(existingUser -> {
                    if (!existingUser.getId().equals(userId)) {
                        throw new IllegalArgumentException("Email already exists");
                    }
                });
        }

        // Update fields
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            userToUpdate.setName(request.getName().trim());
        }
        
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            userToUpdate.setEmail(request.getEmail().trim());
        }
        
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            if (request.getPassword().trim().length() < 6) {
                throw new IllegalArgumentException("Password must be at least 6 characters");
            }
            userToUpdate.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        }

        userRepository.save(userToUpdate);
    }

    @Transactional
    public void updateUserKycStatus(Long userId, String kycStatus) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        UserVerification verification = user.getVerification();
        if (verification == null) {
            verification = new UserVerification();
            verification.setUser(user);
        }
        
        try {
            UserVerification.VerificationLevel level = UserVerification.VerificationLevel.valueOf(kycStatus);
            verification.setVerificationLevel(level);
            
            // Update document status based on verification level
            if (level == UserVerification.VerificationLevel.LEVEL_2_DOCUMENT) {
                verification.setDocumentStatus(UserVerification.DocumentStatus.APPROVED);
            } else if (level == UserVerification.VerificationLevel.LEVEL_1_EMAIL) {
                verification.setEmailVerified(true);
            }
            
            userVerificationRepository.save(verification);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid KYC status: " + kycStatus);
        }
    }

    public List<UserDocumentResponseDTO> getUserDocuments(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        UserVerification verification = user.getVerification();
        if (verification == null || verification.getDocumentUrl() == null) {
            return List.of();
        }
        
        String documentUrl = "";
        try {
            documentUrl = s3Service.generateDownloadUrl(extractS3Key(verification.getDocumentUrl()));
        } catch (Exception e) {
            // Log error silently
        }
        
        UserDocumentResponseDTO document = new UserDocumentResponseDTO(
            verification.getDocumentType() != null ? verification.getDocumentType() : "ID",
            documentUrl,
            verification.getDocumentUploadedAt() != null ? verification.getDocumentUploadedAt() : LocalDateTime.now(),
            verification.getDocumentStatus() != null ? verification.getDocumentStatus().toString() : "PENDING"
        );
        
        return List.of(document);
    }
    
    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }

    private String extractS3Key(String url) {
        if (url != null && !url.startsWith("http")) {
            return url;
        }
        if (url != null && url.contains("kyc/")) {
            String keyPart = url.substring(url.indexOf("kyc/"));
            if (keyPart.contains("?")) {
                keyPart = keyPart.substring(0, keyPart.indexOf("?"));
            }
            return keyPart;
        }
        return url;
    }
}