package com.esports.dto;

import com.esports.entity.UserVerification;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MarketplaceServiceDTO {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private Integer deliveryTime;
    private String category;
    private Boolean active;
    private String freelancerName;
    private String freelancerBio;
    private String freelancerLocation;
    private String freelancerWebsite;
    private String freelancerSkills;
    private String freelancerProfessionalName;
    private String photo1Url;
    private String photo2Url;
    private String photo3Url;
    private Double averageRating;
    private Long reviewCount;
    private UserVerification.VerificationLevel verificationLevel;
}