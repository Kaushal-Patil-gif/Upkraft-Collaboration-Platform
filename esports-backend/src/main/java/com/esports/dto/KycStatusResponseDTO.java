package com.esports.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KycStatusResponseDTO {
    private String verificationLevel;
    private boolean emailVerified;
    private boolean documentUploaded;
    private String documentType;
    private String documentStatus;
}