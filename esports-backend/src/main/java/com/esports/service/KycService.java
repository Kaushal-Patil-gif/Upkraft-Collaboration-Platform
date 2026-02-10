package com.esports.service;

import com.esports.dto.KycStatusResponseDTO;
import com.esports.entity.User;
import com.esports.entity.UserVerification;
import com.esports.repository.UserRepository;
import com.esports.repository.UserVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Random;

@Service
public class KycService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserVerificationRepository userVerificationRepository;
    
    @Autowired
    private S3Service s3Service;
    
    @Autowired
    private EmailService emailService;

    @Transactional
    public void sendOTP(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        emailService.sendOTP(user.getEmail(), otp);
        
        UserVerification verification = userVerificationRepository.findById(user.getId())
            .orElse(new UserVerification());
        if (verification.getUser() == null) {
            verification.setUser(user);
        }
        verification.setOtpCode(otp);
        verification.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        if (verification.getDocumentUrl() == null) {
            verification.setDocumentStatus(null);
        }
        userVerificationRepository.save(verification);
    }

    @Transactional
    public void verifyOTP(String email, String otp) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        UserVerification verification = userVerificationRepository.findById(user.getId())
            .orElse(null);

        if (verification == null || verification.getOtpCode() == null || !verification.getOtpCode().equals(otp)) {
            throw new IllegalArgumentException("Invalid OTP");
        }

        if (verification.getOtpExpiry() == null || verification.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP expired");
        }

        verification.setEmailVerified(true);
        verification.setVerificationLevel(UserVerification.VerificationLevel.LEVEL_1_EMAIL);
        verification.setOtpCode(null);
        verification.setOtpExpiry(null);
        if (verification.getDocumentUrl() == null) {
            verification.setDocumentStatus(null);
        }
        userVerificationRepository.save(verification);
    }

    @Transactional
    public String uploadDocument(String email, MultipartFile file, String documentType) throws IOException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        UserVerification verification = userVerificationRepository.findById(user.getId())
            .orElse(null);
        
        if (verification == null || verification.getVerificationLevel() != UserVerification.VerificationLevel.LEVEL_1_EMAIL) {
            throw new IllegalArgumentException("Email verification required first");
        }
        
        String folder = "kyc/user_" + user.getId();
        Map<String, String> s3Data = s3Service.upload(file, folder);
        String documentUrl = s3Data.get("url");
        
        verification.setDocumentUrl(documentUrl);
        verification.setDocumentType(documentType);
        verification.setDocumentUploadedAt(LocalDateTime.now());
        verification.setDocumentStatus(UserVerification.DocumentStatus.PENDING);
        
        userVerificationRepository.save(verification);
        
        return documentUrl;
    }

    public KycStatusResponseDTO getKYCStatus(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        UserVerification verification = userVerificationRepository.findById(user.getId())
            .orElse(null);
        
        if (verification != null && verification.getDocumentUrl() == null && verification.getDocumentStatus() != null) {
            verification.setDocumentStatus(null);
            userVerificationRepository.save(verification);
        }
        
        return new KycStatusResponseDTO(
            verification != null ? verification.getVerificationLevel().toString() : "UNVERIFIED",
            verification != null ? verification.isEmailVerified() : false,
            verification != null && verification.getDocumentUrl() != null,
            verification != null && verification.getDocumentType() != null ? verification.getDocumentType() : "",
            verification != null && verification.getDocumentUrl() != null ? 
                (verification.getDocumentStatus() != null ? verification.getDocumentStatus().toString() : "PENDING") : "NOT_UPLOADED"
        );
    }
}