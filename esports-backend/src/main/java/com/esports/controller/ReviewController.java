package com.esports.controller;

import com.esports.entity.Project;
import com.esports.entity.Review;
import com.esports.entity.Service;
import com.esports.entity.User;
import com.esports.repository.ProjectRepository;
import com.esports.repository.ReviewRepository;
import com.esports.repository.ServiceRepository;
import com.esports.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<?> getServiceReviews(@PathVariable Long serviceId) {
        try {
            Service service = serviceRepository.findById(serviceId).orElse(null);
            if (service == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Service not found"));
            }

            List<Review> reviews = reviewRepository.findByServiceOrderByCreatedAtDesc(service);
            Double avgRating = reviewRepository.getAverageRatingByService(service);
            Long reviewCount = reviewRepository.getReviewCountByService(service);

            List<Map<String, Object>> reviewData = reviews.stream().map(review -> {
                Map<String, Object> reviewMap = new java.util.HashMap<>();
                reviewMap.put("id", review.getId());
                reviewMap.put("rating", review.getRating());
                reviewMap.put("comment", review.getComment());
                reviewMap.put("userName", review.getUser().getName());
                reviewMap.put("createdAt", review.getCreatedAt());
                return reviewMap;
            }).toList();

            Map<String, Object> response = new java.util.HashMap<>();
            response.put("reviews", reviewData);
            response.put("averageRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
            response.put("reviewCount", reviewCount);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to get reviews"));
        }
    }

    @PostMapping("/project/{projectId}")
    public ResponseEntity<?> addReview(@PathVariable Long projectId, @RequestBody Map<String, Object> reviewData, Authentication auth) {
        try {
            Project project = projectRepository.findById(projectId).orElse(null);
            if (project == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Project not found"));
            }

            User user = userRepository.findByEmail(auth.getName()).orElseThrow();

            // Only creator can review after project completion
            if (!project.getCreator().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body(Map.of("error", "Only project creator can add review"));
            }

            if (!project.getStatus().equals(Project.ProjectStatus.COMPLETED)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Project must be completed to add review"));
            }

            // Check if review already exists for this specific project
            List<Review> existingReviews = reviewRepository.findAll().stream()
                .filter(r -> r.getProject() != null &&
                           r.getProject().getId().equals(projectId) &&
                           r.getUser().getId().equals(user.getId()))
                .toList();

            if (!existingReviews.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "You have already reviewed this project"));
            }

            Review review = new Review();
            review.setService(project.getService());
            review.setUser(user);
            review.setProject(project);
            review.setRating((Integer) reviewData.get("rating"));
            review.setComment((String) reviewData.get("comment"));

            reviewRepository.save(review);

            return ResponseEntity.ok(Map.of("message", "Review added successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to add review: " + e.getMessage()));
        }
    }

    @GetMapping("/project/{projectId}/check")
    public ResponseEntity<?> checkProjectReviewed(@PathVariable Long projectId, Authentication auth) {
        try {
            User user = userRepository.findByEmail(auth.getName()).orElseThrow();

            // Check if review already exists for this specific project by this user
            List<Review> existingReviews = reviewRepository.findAll().stream()
                .filter(r -> r.getProject() != null &&
                           r.getProject().getId().equals(projectId) &&
                           r.getUser().getId().equals(user.getId()))
                .toList();

            return ResponseEntity.ok(Map.of("hasReviewed", !existingReviews.isEmpty()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to check review status"));
        }
    }
}