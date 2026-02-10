package com.esports.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class ProjectResponseDTO {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String status;
    private String paymentStatus;
    private String escrowStatus;
    private LocalDateTime deadline;
    private List<Object> milestones;
    private LocalDateTime createdAt;
    private UserInfoDTO creator;
    private UserInfoDTO freelancer;
    private ServiceInfoDTO service;
    
    @Data
    @AllArgsConstructor
    public static class UserInfoDTO {
        private Long id;
        private String name;
        private String email;
        private String kycStatus;
    }
    
    @Data
    @AllArgsConstructor
    public static class ServiceInfoDTO {
        private Long id;
        private String title;
        private String category;
    }
}