package com.esports.service;

import com.esports.dto.ProjectCreateDTO;
import com.esports.dto.ProjectResponseDTO;
import com.esports.entity.*;
import com.esports.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private ProjectFileRepository projectFileRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private S3Service s3Service;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Map<String, Object> createProject(String email, ProjectCreateDTO projectData) {
        if (projectData.getServiceId() == null || projectData.getTitle() == null) {
            throw new IllegalArgumentException("Missing required fields");
        }
        
        User creator = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        com.esports.entity.Service service = serviceRepository.findById(projectData.getServiceId())
            .orElseThrow(() -> new NoSuchElementException("Service not found"));
        
        if (service.getFreelancer() == null) {
            throw new IllegalArgumentException("Service has no assigned freelancer");
        }
        
        Project project = new Project();
        project.setTitle(projectData.getTitle());
        project.setDescription(projectData.getDescription());
        project.setCreator(creator);
        project.setFreelancer(service.getFreelancer());
        project.setService(service);
        project.setPrice(service.getPrice());
        project.setStatus(Project.ProjectStatus.PENDING);
        project.setPaymentStatus(Project.PaymentStatus.PENDING);
        
        if (projectData.getDeadline() != null) {
            project.setDeadline(projectData.getDeadline());
        }
        
        if (projectData.getMilestones() != null) {
            project.setMilestones(projectData.getMilestones());
        }
        
        Project savedProject = projectRepository.save(project);
        
        return Map.of(
            "id", savedProject.getId(),
            "title", savedProject.getTitle(),
            "status", savedProject.getStatus().toString(),
            "message", "Project created successfully"
        );
    }

    public List<ProjectResponseDTO> getMyProjects(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        List<Project> projects;
        if (user.getRole() == User.Role.CREATOR) {
            projects = projectRepository.findByCreatorOrderByCreatedAtDesc(user);
        } else {
            projects = projectRepository.findByFreelancerOrderByCreatedAtDesc(user);
        }
        
        return projects.stream().map(project -> {
            List<Object> parsedMilestones = List.of();
            if (project.getMilestones() != null) {
                parsedMilestones = project.getMilestones().stream()
                    .map(milestoneStr -> {
                        try {
                            return new ObjectMapper().readValue(milestoneStr, Map.class);
                        } catch (Exception e) {
                            return milestoneStr;
                        }
                    })
                    .collect(Collectors.toList());
            }
            
            return new ProjectResponseDTO(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getPrice(),
                project.getStatus().toString(),
                project.getPaymentStatus().toString(),
                project.getEscrowStatus() != null ? project.getEscrowStatus().toString() : "PENDING",
                project.getDeadline(),
                parsedMilestones,
                project.getCreatedAt(),
                new ProjectResponseDTO.UserInfoDTO(
                    project.getCreator().getId(),
                    project.getCreator().getName(),
                    project.getCreator().getEmail(),
                    project.getCreator().getVerification() != null ? 
                        project.getCreator().getVerification().getVerificationLevel().toString() : "UNVERIFIED"
                ),
                new ProjectResponseDTO.UserInfoDTO(
                    project.getFreelancer().getId(),
                    project.getFreelancer().getName(),
                    project.getFreelancer().getEmail(),
                    project.getFreelancer().getVerification() != null ? 
                        project.getFreelancer().getVerification().getVerificationLevel().toString() : "UNVERIFIED"
                ),
                new ProjectResponseDTO.ServiceInfoDTO(
                    project.getService().getId(),
                    project.getService().getTitle(),
                    project.getService().getCategory()
                )
            );
        }).collect(Collectors.toList());
    }

    public ProjectResponseDTO getProject(String email, Long id) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Project not found"));
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        if (!project.getCreator().getId().equals(user.getId()) && 
            !project.getFreelancer().getId().equals(user.getId())) {
            throw new SecurityException("Access denied");
        }
        
        List<Object> parsedMilestones = List.of();
        if (project.getMilestones() != null) {
            parsedMilestones = project.getMilestones().stream()
                .map(milestoneStr -> {
                    try {
                        // Try to parse as JSON object first
                        return new ObjectMapper().readValue(milestoneStr, Map.class);
                    } catch (Exception e) {
                        // If parsing fails, return the string as-is
                        System.err.println("Failed to parse milestone JSON: " + milestoneStr + ", Error: " + e.getMessage());
                        return milestoneStr;
                    }
                })
                .collect(Collectors.toList());
        }
        
        return new ProjectResponseDTO(
            project.getId(),
            project.getTitle(),
            project.getDescription(),
            project.getPrice(),
            project.getStatus().toString(),
            project.getPaymentStatus().toString(),
            project.getEscrowStatus() != null ? project.getEscrowStatus().toString() : "PENDING",
            project.getDeadline(),
            parsedMilestones,
            project.getCreatedAt(),
            new ProjectResponseDTO.UserInfoDTO(
                project.getCreator().getId(),
                project.getCreator().getName(),
                project.getCreator().getEmail(),
                project.getCreator().getVerification() != null ? 
                    project.getCreator().getVerification().getVerificationLevel().toString() : "UNVERIFIED"
            ),
            new ProjectResponseDTO.UserInfoDTO(
                project.getFreelancer().getId(),
                project.getFreelancer().getName(),
                project.getFreelancer().getEmail(),
                project.getFreelancer().getVerification() != null ? 
                    project.getFreelancer().getVerification().getVerificationLevel().toString() : "UNVERIFIED"
            ),
            new ProjectResponseDTO.ServiceInfoDTO(
                project.getService().getId(),
                project.getService().getTitle(),
                project.getService().getCategory()
            )
        );
    }

    @Transactional
    public Map<String, Object> updatePaymentStatus(String email, Long projectId, Map<String, Object> paymentData) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new NoSuchElementException("Project not found"));
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        if (!project.getCreator().getId().equals(user.getId())) {
            throw new SecurityException("Access denied");
        }
        
        if (paymentData.get("paymentStatus") != null) {
            String paymentStatusString = (String) paymentData.get("paymentStatus");
            try {
                project.setPaymentStatus(Project.PaymentStatus.valueOf(paymentStatusString));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid payment status: " + paymentStatusString);
            }	
            if ("COMPLETED".equals(paymentStatusString)) {
                project.setPaymentDate(LocalDateTime.now());
                project.setEscrowStatus(Project.EscrowStatus.HELD);
                
                final String freelancerEmail = project.getFreelancer().getEmail();
                final String freelancerName = project.getFreelancer().getName();
                final String projectTitle = project.getTitle();
                final Double projectPrice = project.getPrice();
                CompletableFuture.runAsync(() -> {
                    try {
                        emailService.sendProjectNotification(
                            freelancerEmail,
                            "Payment Received - " + projectTitle,
                            "Hi " + freelancerName + ",\n\n" +
                            "Payment has been received in escrow for project: " + projectTitle + "\n" +
                            "Amount on hold: ₹" + projectPrice + "\n\n" +
                            "You can now start working on the project milestones.\n\n" +
                            "Best regards,\nUpkraft Team"
                        );
                    } catch (Exception e) {
                        // Email sending failed
                    }
                });
            }
        }
        
        if (paymentData.get("paymentId") != null) {
            project.setPaymentId((String) paymentData.get("paymentId"));
        }
        
        Project saved = projectRepository.save(project);
        return Map.of("id", saved.getId(), "paymentStatus", saved.getPaymentStatus().toString());
    }

    @Transactional
    public Map<String, Object> updateProjectStatus(String email, Long projectId, Map<String, Object> statusData) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new NoSuchElementException("Project not found"));
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        boolean isFreelancer = project.getFreelancer().getId().equals(user.getId());
        boolean isCreatorCompletingReview = project.getCreator().getId().equals(user.getId()) && 
                                           project.getStatus() == Project.ProjectStatus.IN_REVIEW && 
                                           "COMPLETED".equals(statusData.get("status"));
        
        if (!isFreelancer && !isCreatorCompletingReview) {
            throw new SecurityException("Access denied");
        }
        
        if (statusData.get("status") != null) {
            String statusString = (String) statusData.get("status");
            try {
                Project.ProjectStatus newStatus = Project.ProjectStatus.valueOf(statusString);
                project.setStatus(newStatus);
                project.setUpdatedAt(LocalDateTime.now());
                sendStatusChangeNotifications(project, newStatus);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status: " + statusString);
            }
        }
        
        Project savedProject = projectRepository.save(project);
        
        return Map.of(
            "id", savedProject.getId(),
            "status", savedProject.getStatus().toString(),
            "serviceId", savedProject.getService().getId(),
            "message", "Project status updated successfully"
        );
    }

    public Map<String, Object> updateMilestones(String email, Long projectId, Map<String, Object> milestoneData) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new NoSuchElementException("Project not found"));
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        if (!project.getFreelancer().getId().equals(user.getId())) {
            throw new SecurityException("Access denied");
        }
        
        if (milestoneData.get("milestones") != null) {
            Object milestonesObj = milestoneData.get("milestones");
            if (!(milestonesObj instanceof List)) {
                throw new IllegalArgumentException("Milestones must be a list");
            }
            List<Object> milestoneObjects = (List<Object>) milestonesObj;
            List<String> milestoneStrings = milestoneObjects.stream()
                .map(obj -> {
                    if (obj instanceof String) {
                        return (String) obj;
                    } else if (obj instanceof Map) {
                        Map<String, Object> milestoneMap = (Map<String, Object>) obj;
                        try {
                            return new ObjectMapper().writeValueAsString(milestoneMap);
                        } catch (Exception e) {
                            return milestoneMap.get("text") != null ? milestoneMap.get("text").toString() : "";
                        }
                    }
                    return obj.toString();
                })
                .collect(Collectors.toList());
            project.setMilestones(milestoneStrings);
        }
        
        Project saved = projectRepository.save(project);
        return Map.of("id", saved.getId(), "milestones", saved.getMilestones());
    }

    public List<Map<String, Object>> getMessages(String email, Long projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new NoSuchElementException("Project not found"));
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        if (!project.getCreator().getId().equals(user.getId()) && 
            !project.getFreelancer().getId().equals(user.getId())) {
            throw new SecurityException("Access denied");
        }
        
        List<Message> messages = messageRepository.findByProjectOrderByCreatedAtAsc(project);
        return messages.stream().map(msg -> {
            Map<String, Object> messageMap = new HashMap<>();
            messageMap.put("id", msg.getId());
            messageMap.put("content", msg.getContent());
            messageMap.put("senderName", msg.getSender() != null ? msg.getSender().getName() : "Unknown");
            messageMap.put("senderId", msg.getSender() != null ? msg.getSender().getId() : null);
            messageMap.put("senderVerificationLevel", 
                msg.getSender() != null && msg.getSender().getVerification() != null ? 
                    msg.getSender().getVerification().getVerificationLevel().toString() : "UNVERIFIED");
            messageMap.put("createdAt", msg.getCreatedAt() != null ? msg.getCreatedAt().toString() : "");
            return messageMap;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> sendMessage(String email, Long projectId, Map<String, Object> messageData) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new NoSuchElementException("Project not found"));
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        if (!project.getCreator().getId().equals(user.getId()) && 
            !project.getFreelancer().getId().equals(user.getId())) {
            throw new SecurityException("Access denied");
        }
        
        if (messageData.get("content") == null || ((String) messageData.get("content")).trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }
        
        Message message = new Message();
        message.setContent((String) messageData.get("content"));
        message.setSender(user);
        message.setProject(project);
        
        Message savedMessage = messageRepository.save(message);
        
        Map<String, Object> response = Map.of(
            "id", savedMessage.getId(),
            "content", savedMessage.getContent(),
            "senderName", user.getName(),
            "senderId", user.getId(),
            "createdAt", savedMessage.getCreatedAt().toString()
        );
        
        messagingTemplate.convertAndSend("/topic/project/" + projectId, response);
        
        User recipient = user.getId().equals(project.getCreator().getId()) ? 
            project.getFreelancer() : project.getCreator();
        
        CompletableFuture.runAsync(() -> {
            try {
                emailService.sendProjectNotification(
                    recipient.getEmail(),
                    "New Message - " + project.getTitle(),
                    "Hi " + recipient.getName() + ",\n\n" +
                    "You have a new message in project: " + project.getTitle() + "\n" +
                    "From: " + user.getName() + "\n" +
                    "Message: " + savedMessage.getContent() + "\n\n" +
                    "Please check your project workspace for more details.\n\n" +
                    "Best regards,\nUpkraft Team"
                );
            } catch (Exception e) {
                // Email sending failed
            }
        });
        
        return response;
    }

    @Transactional
    public Map<String, Object> rejectProject(String email, Long projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new NoSuchElementException("Project not found"));
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        if (!project.getFreelancer().getId().equals(user.getId()) || project.getStatus() != Project.ProjectStatus.PENDING) {
            throw new SecurityException("Access denied or project cannot be rejected");
        }
        
        CompletableFuture.runAsync(() -> {
            try {
                emailService.sendProjectNotification(
                    project.getCreator().getEmail(),
                    "Project Rejected - " + project.getTitle(),
                    "Hi " + project.getCreator().getName() + ",\n\n" +
                    "Unfortunately, your project has been rejected by the freelancer: " + project.getTitle() + "\n" +
                    "You can try hiring another freelancer for this project.\n\n" +
                    "Best regards,\nUpkraft Team"
                );
            } catch (Exception e) {
                // Email sending failed
            }
        });
        
        projectRepository.delete(project);
        return Map.of("message", "Project rejected and deleted successfully");
    }

    public Map<String, Object> uploadProjectFile(String email, Long projectId, MultipartFile file) throws IOException {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new NoSuchElementException("Project not found"));
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        if (!project.getCreator().getId().equals(user.getId()) && !project.getFreelancer().getId().equals(user.getId())) {
            throw new SecurityException("Access denied");
        }
        
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        
        if (file.getSize() > 500 * 1024 * 1024) { // 10MB limit
            throw new IllegalArgumentException("File size exceeds 500MB limit");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.startsWith("image/") && !contentType.startsWith("application/") && !contentType.startsWith("text/") && !contentType.startsWith("video/") && !contentType.startsWith("audio/"))) {
            throw new IllegalArgumentException("Invalid file type");
        }
        
        try {
            Map<String, String> uploadResult = s3Service.upload(file, "projects/" + projectId);
            String s3Key = uploadResult.get("key");
            String fileUrl = s3Service.generateDownloadUrl(s3Key);
            
            ProjectFile projectFile = new ProjectFile();
            projectFile.setProject(project);
            projectFile.setUploader(user);
            projectFile.setFileName(file.getOriginalFilename());
            projectFile.setFileSize(file.getSize());
            projectFile.setS3Key(s3Key);
            projectFileRepository.save(projectFile);
            
            return Map.of(
                "fileName", file.getOriginalFilename(),
                "fileSize", file.getSize(),
                "fileUrl", fileUrl,
                "uploaderName", user.getName(),
                "uploaderId", user.getId(),
                "uploadedAt", LocalDateTime.now().toString()
            );
        } catch (IOException e) {
            throw new RuntimeException("File upload failed");
        }
    }

    public List<Map<String, Object>> getProjectFiles(String email, Long projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new NoSuchElementException("Project not found"));
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        if (!project.getCreator().getId().equals(user.getId()) && !project.getFreelancer().getId().equals(user.getId())) {
            throw new SecurityException("Access denied");
        }
        
        List<ProjectFile> projectFiles = projectFileRepository.findByProjectOrderByUploadedAtDesc(project);
        return projectFiles.stream().map(pf -> {
            Map<String, Object> fileMap = new HashMap<>();
            fileMap.put("id", pf.getId());
            fileMap.put("fileName", pf.getFileName() != null ? pf.getFileName() : "Unknown");
            fileMap.put("fileSize", pf.getFileSize());
            fileMap.put("fileUrl", pf.getS3Key() != null ? s3Service.generateDownloadUrl(pf.getS3Key()) : "");
            fileMap.put("uploaderName", pf.getUploader() != null ? pf.getUploader().getName() : "Unknown");
            fileMap.put("uploaderId", pf.getUploader() != null ? pf.getUploader().getId() : null);
            fileMap.put("uploadedAt", pf.getUploadedAt() != null ? pf.getUploadedAt().toString() : "");
            return fileMap;
        }).collect(Collectors.toList());
    }

    private void sendStatusChangeNotifications(Project project, Project.ProjectStatus newStatus) {
        if (newStatus == Project.ProjectStatus.IN_PROGRESS) {
            final String creatorEmail = project.getCreator().getEmail();
            final String creatorName = project.getCreator().getName();
            final String projectTitle = project.getTitle();
            CompletableFuture.runAsync(() -> {
                try {
                    emailService.sendProjectNotification(
                        creatorEmail,
                        "Project Approved - " + projectTitle,
                        "Hi " + creatorName + ",\n\n" +
                        "Your project has been approved by the freelancer: " + projectTitle + "\n" +
                        "You can now proceed with the payment to start the project.\n\n" +
                        "Best regards,\nUpkraft Team"
                    );
                } catch (Exception e) {
                    // Email sending failed
                }
            });
        } else if (newStatus == Project.ProjectStatus.IN_REVIEW) {
            final String creatorEmail = project.getCreator().getEmail();
            final String creatorName = project.getCreator().getName();
            final String projectTitle = project.getTitle();
            CompletableFuture.runAsync(() -> {
                try {
                    emailService.sendProjectNotification(
                        creatorEmail,
                        "Project Submitted for Review - " + projectTitle,
                        "Hi " + creatorName + ",\n\n" +
                        "The freelancer has submitted the project for review: " + projectTitle + "\n" +
                        "Please review the work and approve.\n\n" +
                        "Best regards,\nUpkraft Team"
                    );
                } catch (Exception e) {
                    // Email sending failed
                }
            });
        } else if (newStatus == Project.ProjectStatus.COMPLETED) {
            final String creatorEmail = project.getCreator().getEmail();
            final String creatorName = project.getCreator().getName();
            final String freelancerEmail = project.getFreelancer().getEmail();
            final String freelancerName = project.getFreelancer().getName();
            final String projectTitle = project.getTitle();
            final Double projectPrice = project.getPrice();
            
            CompletableFuture.runAsync(() -> {
                try {
                    emailService.sendProjectNotification(
                        creatorEmail,
                        "Project Completed - " + projectTitle,
                        "Hi " + creatorName + ",\n\n" +
                        "Congratulations! Your project has been completed: " + projectTitle + "\n" +
                        "Total amount: ₹" + projectPrice + "\n\n" +
                        "Thank you for using Upkraft-Platform!\n\n" +
                        "Best regards,\nUpkraft Team"
                    );
                    
                    emailService.sendProjectNotification(
                        freelancerEmail,
                        "Project Completed - " + projectTitle,
                        "Hi " + freelancerName + ",\n\n" +
                        "Congratulations! You have successfully completed the project: " + projectTitle + "\n" +
                        "Payment of ₹" + projectPrice + " has been processed.\n\n" +
                        "Thank you for your excellent work!\n\n" +
                        "Best regards,\nUpkraft Team"
                    );
                } catch (Exception e) {
                    // Email sending failed
                }
            });
        }
    }
}