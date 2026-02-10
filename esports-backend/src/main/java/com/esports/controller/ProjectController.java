package com.esports.controller;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.esports.dto.ApiResponse;
import com.esports.dto.ProjectCreateDTO;
import com.esports.dto.ProjectResponseDTO;
import com.esports.service.ProjectService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasRole('CREATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> createProject(@Valid @RequestBody ProjectCreateDTO projectData, Authentication auth) {
        try {
            Map<String, Object> response = projectService.createProject(auth.getName(), projectData);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("Service not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to create project"));
        }
    }

    @GetMapping("/my-projects")
    public ResponseEntity<?> getMyProjects(Authentication auth) {
        try {
            List<ProjectResponseDTO> projects = projectService.getMyProjects(auth.getName());
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to get projects"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProject(@PathVariable Long id, Authentication auth) {
        try {
            ProjectResponseDTO project = projectService.getProject(auth.getName(), id);
            return ResponseEntity.ok(project);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(ApiResponse.error("Project not found"));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to get project"));
        }
    }

    @PutMapping("/{projectId}/payment")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long projectId, @RequestBody Map<String, Object> paymentData, Authentication auth) {
        try {
            Map<String, Object> result = projectService.updatePaymentStatus(auth.getName(), projectId, paymentData);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Project not found"));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update payment"));
        }
    }

    @PutMapping("/{projectId}/status")
    public ResponseEntity<?> updateProjectStatus(@PathVariable Long projectId, @RequestBody Map<String, Object> statusData, Authentication auth) {
        try {
            Map<String, Object> result = projectService.updateProjectStatus(auth.getName(), projectId, statusData);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Project not found"));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update status"));
        }
    }

    @PutMapping("/{projectId}/milestones")
    public ResponseEntity<?> updateMilestones(@PathVariable Long projectId, @RequestBody Map<String, Object> milestoneData, Authentication auth) {
        try {
            Map<String, Object> result = projectService.updateMilestones(auth.getName(), projectId, milestoneData);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Project not found"));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update milestones"));
        }
    }

    @GetMapping("/{projectId}/messages")
    public ResponseEntity<List<Map<String, Object>>> getMessages(@PathVariable Long projectId, Authentication auth) {
        try {
            List<Map<String, Object>> messages = projectService.getMessages(auth.getName(), projectId);
            return ResponseEntity.ok(messages);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/{projectId}/messages")
    public ResponseEntity<Map<String, Object>> sendMessage(@PathVariable Long projectId, @RequestBody Map<String, Object> messageData, Authentication auth) {
        try {
            Map<String, Object> response = projectService.sendMessage(auth.getName(), projectId, messageData);
            return ResponseEntity.ok(response);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    @DeleteMapping("/{projectId}/reject")
    public ResponseEntity<?> rejectProject(@PathVariable Long projectId, Authentication auth) {
        try {
            Map<String, Object> result = projectService.rejectProject(auth.getName(), projectId);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Project not found"));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied or project cannot be rejected"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to reject project"));
        }
    }
    
    @PostMapping("/{projectId}/files/upload")
    public ResponseEntity<?> uploadProjectFile(@PathVariable Long projectId, @RequestParam("file") MultipartFile file, Authentication auth) {
        try {
            Map<String, Object> result = projectService.uploadProjectFile(auth.getName(), projectId, file);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Project not found"));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to upload file"));
        }
    }
    
    @GetMapping("/{projectId}/files")
    public ResponseEntity<?> getProjectFiles(@PathVariable Long projectId, Authentication auth) {
        try {
            List<Map<String, Object>> files = projectService.getProjectFiles(auth.getName(), projectId);
            return ResponseEntity.ok(files);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Project not found"));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to get files"));
        }
    }
}