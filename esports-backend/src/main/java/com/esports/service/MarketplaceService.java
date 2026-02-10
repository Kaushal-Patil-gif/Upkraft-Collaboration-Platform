package com.esports.service;

import com.esports.dto.MarketplaceServiceDTO;
import com.esports.entity.Service;
import com.esports.entity.UserProfile;
import com.esports.repository.ReviewRepository;
import com.esports.repository.ServiceRepository;
import com.esports.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class MarketplaceService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private UserProfileRepository userProfileRepository;

    public List<MarketplaceServiceDTO> getAllActiveServices() {
        List<Service> services = serviceRepository.findAll();

        return services.stream()
                .map(this::mapToMarketplaceDTO)
                .collect(Collectors.toList());
    }

    private MarketplaceServiceDTO mapToMarketplaceDTO(Service service) {
        UserProfile freelancerProfile = userProfileRepository.findByUser(service.getFreelancer())
                .orElse(null);

        Double avgRating = reviewRepository.getAverageRatingByService(service);
        Long reviewCount = reviewRepository.getReviewCountByService(service);

        return new MarketplaceServiceDTO(
                service.getId(),
                service.getTitle(),
                service.getDescription(),
                service.getPrice(),
                service.getDeliveryTime(),
                service.getCategory(),
                service.getActive(),
                service.getFreelancer().getName(),
                freelancerProfile != null ? freelancerProfile.getBio() : null,
                freelancerProfile != null ? freelancerProfile.getLocation() : null,
                freelancerProfile != null ? freelancerProfile.getWebsite() : null,
                freelancerProfile != null ? freelancerProfile.getSkills() : null,
                freelancerProfile != null ? freelancerProfile.getProfessionalName() : null,
                generatePhotoUrl(service.getPhoto1Url()),
                generatePhotoUrl(service.getPhoto2Url()),
                generatePhotoUrl(service.getPhoto3Url()),
                avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0,
                reviewCount,
                service.getFreelancer().getVerificationLevel()
        );
    }

    private String generatePhotoUrl(String storedUrl) {
        if (storedUrl == null) return null;
        try {
            return s3Service.generateDownloadUrl(extractS3Key(storedUrl));
        } catch (Exception e) {
            return null;
        }
    }

    private String extractS3Key(String url) {
        if (url != null && !url.startsWith("http")) {
            return url;
        }
        if (url != null && url.contains("service-photos/")) {
            String keyPart = url.substring(url.indexOf("service-photos/"));
            if (keyPart.contains("?")) {
                keyPart = keyPart.substring(0, keyPart.indexOf("?"));
            }
            return keyPart;
        }
        return url;
    }
}