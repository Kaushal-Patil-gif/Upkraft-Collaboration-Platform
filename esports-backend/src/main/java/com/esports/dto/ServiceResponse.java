package com.esports.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ServiceResponse {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private Integer deliveryTime;
    private String category;
    private Boolean active;
    private String freelancerName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String photo1Url;
    private String photo2Url;
    private String photo3Url;
}