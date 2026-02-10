package com.esports.repository;

import com.esports.entity.UserVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserVerificationRepository extends JpaRepository<UserVerification, Long> {
    List<UserVerification> findByDocumentStatusAndDocumentUrlIsNotNull(UserVerification.DocumentStatus status);
    List<UserVerification> findByDocumentStatus(UserVerification.DocumentStatus status);
    long countByDocumentStatus(UserVerification.DocumentStatus status);
}