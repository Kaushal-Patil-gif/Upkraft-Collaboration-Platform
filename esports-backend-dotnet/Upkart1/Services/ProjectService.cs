using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Upkart1.Data;
using Upkart1.DTO;
using Upkart1.Entities;
using Upkart1.Entities.Enums;

namespace Upkart1.Services
{
    public class ProjectService : IProjectService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IS3Service _s3Service;

        public ProjectService(ApplicationDbContext context, IEmailService emailService, IS3Service s3Service)
        {
            _context = context;
            _emailService = emailService;
            _s3Service = s3Service;
        }

        public Dictionary<string, object> CreateProject(string email, ProjectCreateDTO projectData)
        {
            if (projectData.ServiceId == null || projectData.Title == null)
                throw new ArgumentException("Missing required fields");

            var creator = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            var service = _context.Services
                .Include(s => s.Freelancer)
                .FirstOrDefault(s => s.Id == projectData.ServiceId)
                ?? throw new KeyNotFoundException("Service not found");

            if (service.Freelancer == null)
                throw new ArgumentException("Service has no assigned freelancer");

            var project = new Project
            {
                Title = projectData.Title,
                Description = projectData.Description,
                CreatorId = creator.Id,
                FreelancerId = service.FreelancerId,
                ServiceId = service.Id,
                Price = service.Price,
                Status = ProjectStatus.PENDING,
                PaymentStatus = PaymentStatus.PENDING,
                Deadline = DateTime.Parse(projectData.Deadline),
                Milestones = projectData.Milestones?.Any() == true ? projectData.Milestones.Select(m => 
                    JsonConvert.SerializeObject(new { title = m, status = "PENDING", dueDate = (string)null, paymentReleased = false })
                ).ToList() : new List<string>()
            };

            _context.Projects.Add(project);
            _context.SaveChanges();

            return new Dictionary<string, object>
            {
                ["id"] = project.Id,
                ["title"] = project.Title,
                ["status"] = project.Status.ToString(),
                ["message"] = "Project created successfully"
            };
        }

        public List<ProjectResponseDTO> GetMyProjects(string email)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            List<Project> projects;
            if (user.Role == Role.CREATOR)
            {
                projects = _context.Projects
                    .Include(p => p.Creator).ThenInclude(u => u.Verification)
                    .Include(p => p.Freelancer).ThenInclude(u => u.Verification)
                    .Include(p => p.Service)
                    .Where(p => p.CreatorId == user.Id)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToList();
            }
            else
            {
                projects = _context.Projects
                    .Include(p => p.Creator).ThenInclude(u => u.Verification)
                    .Include(p => p.Freelancer).ThenInclude(u => u.Verification)
                    .Include(p => p.Service)
                    .Where(p => p.FreelancerId == user.Id)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToList();
            }

            return projects.Select(project =>
            {
                var parsedMilestones = new List<object>();
                if (project.Milestones != null)
                {
                    parsedMilestones = project.Milestones.Select(milestoneStr =>
                    {
                        try
                        {
                            return JsonConvert.DeserializeObject(milestoneStr);
                        }
                        catch
                        {
                            return milestoneStr;
                        }
                    }).ToList();
                }

                return new ProjectResponseDTO(
                    project.Id,
                    project.Title,
                    project.Description,
                    project.Price,
                    project.Status.ToString(),
                    project.PaymentStatus.ToString(),
                    project.EscrowStatus.ToString(),
                    project.Deadline ?? DateTime.MinValue,
                    parsedMilestones,
                    project.CreatedAt,
                    new ProjectResponseDTO.UserInfoDTO(
                        project.Creator.Id,
                        project.Creator.Name,
                        project.Creator.Email,
                        project.Creator.VerificationLevel.ToString()
                    ),
                    new ProjectResponseDTO.UserInfoDTO(
                        project.Freelancer.Id,
                        project.Freelancer.Name,
                        project.Freelancer.Email,
                        project.Freelancer.VerificationLevel.ToString()
                    ),
                    new ProjectResponseDTO.ServiceInfoDTO(
                        project.Service.Id,
                        project.Service.Title,
                        project.Service.Category
                    )
                );
            }).ToList();
        }

        public ProjectResponseDTO GetProject(string email, long id)
        {
            var project = _context.Projects
                .Include(p => p.Creator).ThenInclude(u => u.Verification)
                .Include(p => p.Freelancer).ThenInclude(u => u.Verification)
                .Include(p => p.Service)
                .FirstOrDefault(p => p.Id == id)
                ?? throw new KeyNotFoundException("Project not found");

            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            if (project.CreatorId != user.Id && project.FreelancerId != user.Id)
                throw new UnauthorizedAccessException("Access denied");

            var parsedMilestones = new List<object>();
            if (project.Milestones != null)
            {
                parsedMilestones = project.Milestones.Select(milestoneStr =>
                {
                    try
                    {
                        return JsonConvert.DeserializeObject(milestoneStr);
                    }
                    catch
                    {
                        return milestoneStr;
                    }
                }).ToList();
            }

            return new ProjectResponseDTO(
                project.Id,
                project.Title,
                project.Description,
                project.Price,
                project.Status.ToString(),
                project.PaymentStatus.ToString(),
                project.EscrowStatus.ToString(),
                project.Deadline ?? DateTime.MinValue,
                parsedMilestones,
                project.CreatedAt,
                new ProjectResponseDTO.UserInfoDTO(
                    project.Creator.Id,
                    project.Creator.Name,
                    project.Creator.Email,
                    project.Creator.VerificationLevel.ToString()
                ),
                new ProjectResponseDTO.UserInfoDTO(
                    project.Freelancer.Id,
                    project.Freelancer.Name,
                    project.Freelancer.Email,
                    project.Freelancer.VerificationLevel.ToString()
                ),
                new ProjectResponseDTO.ServiceInfoDTO(
                    project.Service.Id,
                    project.Service.Title,
                    project.Service.Category
                )
            );
        }

        public Dictionary<string, object> UpdatePaymentStatus(string email, long projectId, Dictionary<string, object> paymentData)
        {
            var project = _context.Projects
                .Include(p => p.Freelancer)
                .FirstOrDefault(p => p.Id == projectId)
                ?? throw new KeyNotFoundException("Project not found");

            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            if (project.CreatorId != user.Id)
                throw new UnauthorizedAccessException("Access denied");

            if (paymentData.ContainsKey("paymentStatus"))
            {
                var paymentStatusString = paymentData["paymentStatus"].ToString();
                if (Enum.TryParse<PaymentStatus>(paymentStatusString, out var paymentStatus))
                {
                    project.PaymentStatus = paymentStatus;
                    if (paymentStatusString == "COMPLETED")
                    {
                        project.PaymentDate = DateTime.Now;
                        project.EscrowStatus = EscrowStatus.Held;

                        var freelancerEmail = project.Freelancer.Email;
                        var freelancerName = project.Freelancer.Name;
                        var projectTitle = project.Title;
                        var projectPrice = project.Price;

                        _ = Task.Run(() =>
                        {
                            try
                            {
                                _emailService.SendProjectNotification(
                                    freelancerEmail,
                                    $"Payment Received - {projectTitle}",
                                    $"Hi {freelancerName},\n\n" +
                                    $"Payment has been received in escrow for project: {projectTitle}\n" +
                                    $"Amount on hold: ₹{projectPrice}\n\n" +
                                    $"You can now start working on the project milestones.\n\n" +
                                    $"Best regards,\nUpkraft Team"
                                );
                            }
                            catch
                            {
                                // Email sending failed
                            }
                        });
                    }
                }
                else
                {
                    throw new ArgumentException($"Invalid payment status: {paymentStatusString}");
                }
            }

            if (paymentData.ContainsKey("paymentId"))
            {
                project.PaymentId = paymentData["paymentId"].ToString();
            }

            _context.SaveChanges();
            return new Dictionary<string, object>
            {
                ["id"] = project.Id,
                ["paymentStatus"] = project.PaymentStatus.ToString()
            };
        }

        public Dictionary<string, object> UpdateProjectStatus(string email, long projectId, Dictionary<string, object> statusData)
        {
            var project = _context.Projects
                .Include(p => p.Creator)
                .Include(p => p.Freelancer)
                .Include(p => p.Service)
                .FirstOrDefault(p => p.Id == projectId)
                ?? throw new KeyNotFoundException("Project not found");

            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            var isFreelancer = project.FreelancerId == user.Id;
            var isCreatorCompletingReview = project.CreatorId == user.Id &&
                                           project.Status == ProjectStatus.IN_REVIEW &&
                                           statusData["status"].ToString() == "COMPLETED";

            if (!isFreelancer && !isCreatorCompletingReview)
                throw new UnauthorizedAccessException("Access denied");

            if (statusData.ContainsKey("status"))
            {
                var statusString = statusData["status"].ToString();
                if (Enum.TryParse<ProjectStatus>(statusString, out var newStatus))
                {
                    project.Status = newStatus;
                    project.UpdatedAt = DateTime.Now;
                    SendStatusChangeNotifications(project, newStatus);
                }
                else
                {
                    throw new ArgumentException($"Invalid status: {statusString}");
                }
            }

            _context.SaveChanges();

            return new Dictionary<string, object>
            {
                ["id"] = project.Id,
                ["status"] = project.Status.ToString(),
                ["serviceId"] = project.Service.Id,
                ["message"] = "Project status updated successfully"
            };
        }

        public Dictionary<string, object> UpdateMilestones(string email, long projectId, Dictionary<string, object> milestoneData)
        {
            var project = _context.Projects.FirstOrDefault(p => p.Id == projectId)
                ?? throw new KeyNotFoundException("Project not found");

            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            if (project.FreelancerId != user.Id)
                throw new UnauthorizedAccessException("Access denied");

            if (milestoneData.ContainsKey("milestones"))
            {
                var milestonesObj = milestoneData["milestones"];
                if (milestonesObj is List<object> milestoneObjects)
                {
                    var milestoneStrings = milestoneObjects.Select(obj =>
                    {
                        if (obj is string str) return str;
                        return obj.ToString();
                    }).ToList();
                    
                    project.Milestones = milestoneStrings;
                    project.UpdatedAt = DateTime.Now;
                    _context.Update(project);
                }
            }

            _context.SaveChanges();
            
            // Return parsed milestones like GetProject does
            var parsedMilestones = project.Milestones?.Select((milestoneStr, index) =>
            {
                try
                {
                    var parsed = JsonConvert.DeserializeObject(milestoneStr);
                    return parsed;
                }
                catch
                {
                    // If parsing fails, create proper milestone object
                    return new { title = $"Milestone {index + 1}", status = "PENDING", dueDate = (string)null, paymentReleased = false };
                }
            }).ToList() ?? new List<object>();
            
            return new Dictionary<string, object>
            {
                ["milestones"] = parsedMilestones
            };
        }

        public List<Dictionary<string, object>> GetMessages(string email, long projectId)
        {
            var project = _context.Projects.FirstOrDefault(p => p.Id == projectId)
                ?? throw new KeyNotFoundException("Project not found");

            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            if (project.CreatorId != user.Id && project.FreelancerId != user.Id)
                throw new UnauthorizedAccessException("Access denied");

            var messages = _context.Messages
                .Include(m => m.Sender).ThenInclude(u => u.Verification)
                .Where(m => m.ProjectId == projectId)
                .OrderBy(m => m.CreatedAt)
                .ToList();

            return messages.Select(msg => new Dictionary<string, object>
            {
                ["id"] = msg.Id,
                ["content"] = msg.Content,
                ["senderName"] = msg.Sender?.Name ?? "Unknown",
                ["senderId"] = msg.Sender?.Id ?? 0,
                ["senderVerificationLevel"] = msg.Sender?.VerificationLevel.ToString() ?? "UNVERIFIED",
                ["createdAt"] = msg.CreatedAt.ToString()
            }).ToList();
        }

        public Dictionary<string, object> SendMessage(string email, long projectId, Dictionary<string, object> messageData)
        {
            var project = _context.Projects
                .Include(p => p.Creator)
                .Include(p => p.Freelancer)
                .FirstOrDefault(p => p.Id == projectId)
                ?? throw new KeyNotFoundException("Project not found");

            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            if (project.CreatorId != user.Id && project.FreelancerId != user.Id)
                throw new UnauthorizedAccessException("Access denied");

            if (!messageData.ContainsKey("content") || string.IsNullOrWhiteSpace(messageData["content"].ToString()))
                throw new ArgumentException("Message content cannot be empty");

            var message = new Message
            {
                Content = messageData["content"].ToString(),
                SenderId = user.Id,
                ProjectId = project.Id
            };

            _context.Messages.Add(message);
            _context.SaveChanges();

            var response = new Dictionary<string, object>
            {
                ["id"] = message.Id,
                ["content"] = message.Content,
                ["senderName"] = user.Name,
                ["senderId"] = user.Id,
                ["createdAt"] = message.CreatedAt.ToString()
            };

            var recipient = user.Id == project.CreatorId ? project.Freelancer : project.Creator;

            _ = Task.Run(() =>
            {
                try
                {
                    _emailService.SendProjectNotification(
                        recipient.Email,
                        $"New Message - {project.Title}",
                        $"Hi {recipient.Name},\n\n" +
                        $"You have a new message in project: {project.Title}\n" +
                        $"From: {user.Name}\n" +
                        $"Message: {message.Content}\n\n" +
                        $"Please check your project workspace for more details.\n\n" +
                        $"Best regards,\nUpkraft Team"
                    );
                }
                catch
                {
                    // Email sending failed
                }
            });

            return response;
        }

        public Dictionary<string, object> RejectProject(string email, long projectId)
        {
            var project = _context.Projects
                .Include(p => p.Creator)
                .FirstOrDefault(p => p.Id == projectId)
                ?? throw new KeyNotFoundException("Project not found");

            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            if (project.FreelancerId != user.Id || project.Status != ProjectStatus.PENDING)
                throw new UnauthorizedAccessException("Access denied or project cannot be rejected");

            _ = Task.Run(() =>
            {
                try
                {
                    _emailService.SendProjectNotification(
                        project.Creator.Email,
                        $"Project Rejected - {project.Title}",
                        $"Hi {project.Creator.Name},\n\n" +
                        $"Unfortunately, your project has been rejected by the freelancer: {project.Title}\n" +
                        $"You can try hiring another freelancer for this project.\n\n" +
                        $"Best regards,\nUpkraft Team"
                    );
                }
                catch
                {
                    // Email sending failed
                }
            });

            _context.Projects.Remove(project);
            _context.SaveChanges();
            return new Dictionary<string, object>
            {
                ["message"] = "Project rejected and deleted successfully"
            };
        }

        public async Task<Dictionary<string, object>> UploadProjectFile(string email, long projectId, IFormFile file)
        {
            var project = _context.Projects.FirstOrDefault(p => p.Id == projectId)
                ?? throw new KeyNotFoundException("Project not found");

            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            if (project.CreatorId != user.Id && project.FreelancerId != user.Id)
                throw new UnauthorizedAccessException("Access denied");

            if (file.Length == 0)
                throw new ArgumentException("File cannot be empty");

            if (file.Length > 500 * 1024 * 1024) // 500MB limit
                throw new ArgumentException("File size exceeds 500MB limit");

            var contentType = file.ContentType;
            if (contentType == null || (!contentType.StartsWith("image/") && !contentType.StartsWith("application/") &&
                !contentType.StartsWith("text/") && !contentType.StartsWith("video/") && !contentType.StartsWith("audio/")))
                throw new ArgumentException("Invalid file type");

            try
            {
                var uploadResult = await _s3Service.Upload(file, $"projects/{projectId}");
                var s3Key = uploadResult["key"];
                var fileUrl = _s3Service.GenerateDownloadUrl(s3Key);

                var projectFile = new ProjectFile
                {
                    ProjectId = project.Id,
                    UploaderId = user.Id,
                    FileName = file.FileName,
                    FileSize = file.Length,
                    S3Key = s3Key
                };
                _context.ProjectFiles.Add(projectFile);
                _context.SaveChanges();

                return new Dictionary<string, object>
                {
                    ["fileName"] = file.FileName,
                    ["fileSize"] = file.Length,
                    ["fileUrl"] = fileUrl,
                    ["uploaderName"] = user.Name,
                    ["uploaderId"] = user.Id,
                    ["uploadedAt"] = DateTime.Now.ToString()
                };
            }
            catch
            {
                throw new Exception("File upload failed");
            }
        }

        public List<Dictionary<string, object>> GetProjectFiles(string email, long projectId)
        {
            var project = _context.Projects.FirstOrDefault(p => p.Id == projectId)
                ?? throw new KeyNotFoundException("Project not found");

            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            if (project.CreatorId != user.Id && project.FreelancerId != user.Id)
                throw new UnauthorizedAccessException("Access denied");

            var projectFiles = _context.ProjectFiles
                .Include(pf => pf.Uploader)
                .Where(pf => pf.ProjectId == projectId)
                .OrderByDescending(pf => pf.UploadedAt)
                .ToList();

            return projectFiles.Select(pf => new Dictionary<string, object>
            {
                ["id"] = pf.Id,
                ["fileName"] = pf.FileName ?? "Unknown",
                ["fileSize"] = pf.FileSize,
                ["fileUrl"] = pf.S3Key != null ? _s3Service.GenerateDownloadUrl(pf.S3Key) : "",
                ["uploaderName"] = pf.Uploader?.Name ?? "Unknown",
                ["uploaderId"] = pf.Uploader?.Id ?? 0,
                ["uploadedAt"] = pf.UploadedAt.ToString()
            }).ToList();
        }

        private void SendStatusChangeNotifications(Project project, ProjectStatus newStatus)
        {
            switch (newStatus)
            {
                case ProjectStatus.IN_PROGRESS:
                    _ = Task.Run(() =>
                    {
                        try
                        {
                            _emailService.SendProjectNotification(
                                project.Creator.Email,
                                $"Project Approved - {project.Title}",
                                $"Hi {project.Creator.Name},\n\n" +
                                $"Your project has been approved by the freelancer: {project.Title}\n" +
                                $"You can now proceed with the payment to start the project.\n\n" +
                                $"Best regards,\nUpkraft Team"
                            );
                        }
                        catch
                        {
                            // Email sending failed
                        }
                    });
                    break;

                case ProjectStatus.IN_REVIEW:
                    _ = Task.Run(() =>
                    {
                        try
                        {
                            _emailService.SendProjectNotification(
                                project.Creator.Email,
                                $"Project Submitted for Review - {project.Title}",
                                $"Hi {project.Creator.Name},\n\n" +
                                $"The freelancer has submitted the project for review: {project.Title}\n" +
                                $"Please review the work and approve.\n\n" +
                                $"Best regards,\nUpkraft Team"
                            );
                        }
                        catch
                        {
                            // Email sending failed
                        }
                    });
                    break;

                case ProjectStatus.COMPLETED:
                    _ = Task.Run(() =>
                    {
                        try
                        {
                            _emailService.SendProjectNotification(
                                project.Creator.Email,
                                $"Project Completed - {project.Title}",
                                $"Hi {project.Creator.Name},\n\n" +
                                $"Congratulations! Your project has been completed: {project.Title}\n" +
                                $"Total amount: ₹{project.Price}\n\n" +
                                $"Thank you for using Upkraft-Platform!\n\n" +
                                $"Best regards,\nUpkraft Team"
                            );

                            _emailService.SendProjectNotification(
                                project.Freelancer.Email,
                                $"Project Completed - {project.Title}",
                                $"Hi {project.Freelancer.Name},\n\n" +
                                $"Congratulations! You have successfully completed the project: {project.Title}\n" +
                                $"Payment of ₹{project.Price} has been processed.\n\n" +
                                $"Thank you for your excellent work!\n\n" +
                                $"Best regards,\nUpkraft Team"
                            );
                        }
                        catch
                        {
                            // Email sending failed
                        }
                    });
                    break;
            }
        }
    }
}