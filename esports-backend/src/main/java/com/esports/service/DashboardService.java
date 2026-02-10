package com.esports.service;

import com.esports.dto.DashboardResponse;
import com.esports.entity.Project;
import com.esports.entity.User;
import com.esports.repository.ProjectRepository;
import com.esports.repository.ReviewRepository;
import com.esports.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public DashboardResponse getCreatorDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        List<Project> projects = projectRepository.findByCreatorOrderByCreatedAtDesc(user);

        long activeProjects = projects.stream()
                .filter(p -> p.getStatus() != Project.ProjectStatus.COMPLETED).count();
        long completedProjects = projects.stream()
                .filter(p -> p.getStatus() == Project.ProjectStatus.COMPLETED).count();
        double totalSpent = projects.stream()
                .filter(p -> p.getPaymentStatus() == Project.PaymentStatus.COMPLETED)
                .mapToDouble(Project::getPrice).sum();

        DashboardResponse.DashboardStats stats = new DashboardResponse.DashboardStats(
                projects.size(), activeProjects, completedProjects, totalSpent, 0.0
        );

        List<DashboardResponse.ProjectSummary> projectList = projects.stream()
                .map(project -> new DashboardResponse.ProjectSummary(
                        project.getId(),
                        project.getTitle(),
                        formatStatus(project.getStatus().toString()),
                        project.getFreelancer().getName(),
                        project.getPrice()
                ))
                .collect(Collectors.toList());

        return new DashboardResponse(stats, projectList);
    }

    public DashboardResponse getFreelancerDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        List<Project> projects = projectRepository.findByFreelancerOrderByCreatedAtDesc(user);

        long activeProjects = projects.stream()
                .filter(p -> p.getStatus() != Project.ProjectStatus.COMPLETED).count();
        long completedProjects = projects.stream()
                .filter(p -> p.getStatus() == Project.ProjectStatus.COMPLETED).count();
        double totalEarnings = projects.stream()
                .filter(p -> p.getStatus() == Project.ProjectStatus.COMPLETED &&
                        p.getPaymentStatus() == Project.PaymentStatus.COMPLETED)
                .mapToDouble(Project::getPrice).sum();

        // Calculate average rating from reviews
        Double avgRating = reviewRepository.findAverageRatingByFreelancer(user);
        double rating = avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0;

        DashboardResponse.DashboardStats stats = new DashboardResponse.DashboardStats(
                projects.size(), activeProjects, completedProjects, totalEarnings, rating
        );

        List<DashboardResponse.ProjectSummary> projectList = projects.stream()
                .map(project -> new DashboardResponse.ProjectSummary(
                        project.getId(),
                        project.getTitle(),
                        formatStatus(project.getStatus().toString()),
                        project.getCreator().getName(),
                        project.getPrice()
                ))
                .collect(Collectors.toList());

        return new DashboardResponse(stats, projectList);
    }

    private String formatStatus(String status) {
        return switch (status) {
            case "IN_PROGRESS" -> "In Progress";
            case "IN_REVIEW" -> "In Review";
            case "COMPLETED" -> "Completed";
            default -> status.replace("_", " ");
        };
    }
}