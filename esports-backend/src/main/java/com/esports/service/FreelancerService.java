package com.esports.service;

import com.esports.dto.ServiceResponse;
import com.esports.entity.Service;
import com.esports.entity.User;
import com.esports.repository.ServiceRepository;
import com.esports.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class FreelancerService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private S3Service s3Service;

    @Transactional
    public Service createService(String email, String title, String description, Double price,
                               Integer deliveryTime, String category, Boolean active,
                               MultipartFile photo1, MultipartFile photo2, MultipartFile photo3) {

        User freelancer = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));

        Service service = new Service();
        service.setTitle(title);
        service.setDescription(description);
        service.setPrice(price);
        service.setCategory(category);
        service.setDeliveryTime(deliveryTime);
        service.setFreelancer(freelancer);
        service.setActive(active);

        // Handle photo uploads
        uploadPhoto(photo1, service::setPhoto1Url);
        uploadPhoto(photo2, service::setPhoto2Url);
        uploadPhoto(photo3, service::setPhoto3Url);

        return serviceRepository.save(service);
    }

    public List<ServiceResponse> getFreelancerServices(String email) {
        User freelancer = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));

        List<Service> services = serviceRepository.findByFreelancer(freelancer);

        return services.stream()
            .map(service -> new ServiceResponse(
                service.getId(),
                service.getTitle(),
                service.getDescription(),
                service.getPrice(),
                service.getDeliveryTime(),
                service.getCategory(),
                service.getActive(),
                service.getFreelancer().getName(),
                service.getCreatedAt(),
                service.getUpdatedAt(),
                generatePhotoUrl(service.getPhoto1Url()),
                generatePhotoUrl(service.getPhoto2Url()),
                generatePhotoUrl(service.getPhoto3Url())
            ))
            .collect(Collectors.toList());
    }

    @Transactional
    public Service updateService(String email, Long id, String title, String description, Double price,
                               Integer deliveryTime, String category, Boolean active,
                               MultipartFile photo1, MultipartFile photo2, MultipartFile photo3) {

        User freelancer = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));

        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Service not found"));

        if (!service.getFreelancer().getId().equals(freelancer.getId())) {
            throw new SecurityException("Unauthorized access to service");
        }

        service.setTitle(title);
        service.setDescription(description);
        service.setPrice(price);
        service.setCategory(category);
        service.setDeliveryTime(deliveryTime);
        service.setActive(active);

        // Handle photo uploads
        if (photo1 != null && !photo1.isEmpty()) {
            uploadPhoto(photo1, service::setPhoto1Url);
        }
        if (photo2 != null && !photo2.isEmpty()) {
            uploadPhoto(photo2, service::setPhoto2Url);
        }
        if (photo3 != null && !photo3.isEmpty()) {
            uploadPhoto(photo3, service::setPhoto3Url);
        }

        return serviceRepository.save(service);
    }

    public Service getService(Long id) {
        return serviceRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Service not found"));
    }

    @Transactional
    public void deleteService(String email, Long id) {
        User freelancer = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));

        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Service not found"));

        if (!service.getFreelancer().getId().equals(freelancer.getId())) {
            throw new SecurityException("Unauthorized access to service");
        }

        serviceRepository.delete(service);
    }

    private void uploadPhoto(MultipartFile photo, PhotoUrlSetter setter) {
        if (photo != null && !photo.isEmpty()) {
            try {
                Map<String, String> result = s3Service.upload(photo, "service-photos");
                setter.setUrl(result.get("url"));
            } catch (Exception e) {
                // Log error silently, continue without photo
            }
        }
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

    @FunctionalInterface
    private interface PhotoUrlSetter {
        void setUrl(String url);
    }
}