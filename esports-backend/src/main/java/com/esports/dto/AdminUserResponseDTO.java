package com.esports.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AdminUserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String kycStatus;
    private Boolean active;
    private LocalDateTime createdAt;
}