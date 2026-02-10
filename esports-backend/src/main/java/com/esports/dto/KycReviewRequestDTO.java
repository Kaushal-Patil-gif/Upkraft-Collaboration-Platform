package com.esports.dto;

import lombok.Data;

@Data
public class KycReviewRequestDTO {
    private Long userId;
    private String action; // "approve" or "reject"
    private String remarks;
}