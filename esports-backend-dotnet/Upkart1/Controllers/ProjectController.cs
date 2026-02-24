using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Upkart1.DTO;
using Upkart1.Services;

namespace Upkart1.Controllers
{
    [ApiController]
    [Route("api/projects")]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpPost]
        [Authorize(Roles = "CREATOR,ADMIN")]
        public IActionResult CreateProject([FromBody] ProjectCreateDTO projectData)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var response = _projectService.CreateProject(email, projectData);
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("Service not found"));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Failed to create project"));
            }
        }

        [HttpGet("my-projects")]
        public IActionResult GetMyProjects()
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var projects = _projectService.GetMyProjects(email);
                return Ok(projects);
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Failed to get projects"));
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetProject(long id)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var project = _projectService.GetProject(email, id);
                return Ok(project);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("Project not found"));
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403, ApiResponse<object>.ErrorResponse("Access denied"));
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Failed to get project"));
            }
        }

        [HttpPut("{projectId}/payment")]
        public IActionResult UpdatePaymentStatus(long projectId, [FromBody] Dictionary<string, object> paymentData)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var result = _projectService.UpdatePaymentStatus(email, projectId, paymentData);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { error = "Project not found" });
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403, new { error = "Access denied" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Failed to update payment" });
            }
        }

        [HttpPut("{projectId}/status")]
        public IActionResult UpdateProjectStatus(long projectId, [FromBody] Dictionary<string, object> statusData)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var result = _projectService.UpdateProjectStatus(email, projectId, statusData);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { error = "Project not found" });
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403, new { error = "Access denied" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Failed to update status" });
            }
        }

        [HttpPut("{projectId}/milestones")]
        public IActionResult UpdateMilestones(long projectId, [FromBody] Dictionary<string, object> milestoneData)
        {
            try
            {
                Console.WriteLine($"UpdateMilestones called for project {projectId}");
                Console.WriteLine($"Milestone data: {System.Text.Json.JsonSerializer.Serialize(milestoneData)}");
                
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var result = _projectService.UpdateMilestones(email, projectId, milestoneData);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                Console.WriteLine($"KeyNotFoundException: {ex.Message}");
                return NotFound(new { error = "Project not found" });
            }
            catch (UnauthorizedAccessException ex)
            {
                Console.WriteLine($"UnauthorizedAccessException: {ex.Message}");
                return StatusCode(403, new { error = "Access denied" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return StatusCode(500, new { error = "Failed to update milestones", details = ex.Message });
            }
        }

        [HttpGet("{projectId}/messages")]
        public IActionResult GetMessages(long projectId)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var messages = _projectService.GetMessages(email, projectId);
                return Ok(messages);
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        [HttpPost("{projectId}/messages")]
        public IActionResult SendMessage(long projectId, [FromBody] Dictionary<string, object> messageData)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var response = _projectService.SendMessage(email, projectId, messageData);
                return Ok(response);
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        [HttpDelete("{projectId}/reject")]
        public IActionResult RejectProject(long projectId)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var result = _projectService.RejectProject(email, projectId);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { error = "Project not found" });
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403, new { error = "Access denied or project cannot be rejected" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Failed to reject project" });
            }
        }

        [HttpPost("{projectId}/files/upload")]
        public async Task<IActionResult> UploadProjectFile(long projectId, [FromForm] IFormFile file)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var result = await _projectService.UploadProjectFile(email, projectId, file);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { error = "Project not found" });
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403, new { error = "Access denied" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Failed to upload file" });
            }
        }

        [HttpGet("{projectId}/files")]
        public IActionResult GetProjectFiles(long projectId)
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                var files = _projectService.GetProjectFiles(email, projectId);
                return Ok(files);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { error = "Project not found" });
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(403, new { error = "Access denied" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Failed to get files" });
            }
        }
    }
}