package com.esports.dto;

import java.time.LocalDateTime;

public class UserDocumentResponseDTO {
    private String documentType;
    private String documentUrl;
    private LocalDateTime uploadedAt;
    private String status;

    public UserDocumentResponseDTO() {}

    public UserDocumentResponseDTO(String documentType, String documentUrl, LocalDateTime uploadedAt, String status) {
        this.documentType = documentType;
        this.documentUrl = documentUrl;
        this.uploadedAt = uploadedAt;
        this.status = status;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getDocumentUrl() {
        return documentUrl;
    }

    public void setDocumentUrl(String documentUrl) {
        this.documentUrl = documentUrl;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}