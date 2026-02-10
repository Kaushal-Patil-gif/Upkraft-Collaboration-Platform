package com.esports.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KycDocumentResponseDTO {
    private Long userId;
    private String userName;
    private String userEmail;
    private String documentType;
    private String documentUrl;
    private String uploadedAt;
    private String status;
}