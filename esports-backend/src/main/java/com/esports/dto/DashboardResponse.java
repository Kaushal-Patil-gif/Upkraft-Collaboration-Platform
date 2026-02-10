package com.esports.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class DashboardResponse {
    private DashboardStats stats;
    private List<ProjectSummary> projects;

    @Data
    @AllArgsConstructor
    public static class DashboardStats {
        private long totalProjects;
        private long activeProjects;
        private long completedProjects;
        private double totalSpent;
        private double rating;
    }

    @Data
    @AllArgsConstructor
    public static class ProjectSummary {
        private Long id;
        private String title;
        private String status;
        private String freelancer;
        private Double price;
    }
}