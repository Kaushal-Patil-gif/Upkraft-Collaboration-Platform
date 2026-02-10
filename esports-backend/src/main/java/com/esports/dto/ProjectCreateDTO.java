package com.esports.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProjectCreateDTO {
    @NotBlank(message = "Title is required")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Title must contain only alphabets and spaces")
    @Size(max = 20, message = "Title must not exceed 20 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 300, message = "Description must not exceed 300 characters")
    private String description;

    @NotNull(message = "Service ID is required")
    private Long serviceId;

    @NotNull(message = "Deadline is required")
    @Future(message = "Deadline must be in the future")
    private LocalDateTime deadline;

    @NotNull(message = "At least 2 milestones are required")
    @Size(min = 2, message = "At least 2 milestones are required")
    private List<String> milestones;
}