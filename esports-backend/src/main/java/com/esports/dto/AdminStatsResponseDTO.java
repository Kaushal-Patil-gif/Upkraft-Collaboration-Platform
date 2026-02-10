package com.esports.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminStatsResponseDTO {
    private Long totalUsers;
    private Long activeProjects;
    private Long pendingKyc;
    private Double totalProjectValue;
    private Double platformRevenue;
    private Double freelancerEarnings;
    private Double platformFeePercentage;
}