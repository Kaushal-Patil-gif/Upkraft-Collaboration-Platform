using System.Text.Json.Serialization;

namespace Upkart1.DTO
{
    public class UserResponseDTO
    {
        [JsonPropertyName("id")]
        public long Id { get; set; }
        
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        [JsonPropertyName("email")]
        public string Email { get; set; }
        
        [JsonPropertyName("role")]
        public string Role { get; set; }
        
        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; }
        
        [JsonPropertyName("bio")]
        public string Bio { get; set; }
        
        [JsonPropertyName("location")]
        public string Location { get; set; }
        
        [JsonPropertyName("website")]
        public string Website { get; set; }
        
        [JsonPropertyName("skills")]
        public string Skills { get; set; }
        
        [JsonPropertyName("professionalName")]
        public string ProfessionalName { get; set; }
        
        [JsonPropertyName("channelName")]
        public string ChannelName { get; set; }

        public UserResponseDTO() { }

        public UserResponseDTO(long id, string name, string email, string role, 
            DateTime createdAt, string bio, string location, string website, 
            string skills, string professionalName, string channelName)
        {
            this.Id = id;
            this.Name = name;
            this.Email = email;
            this.Role = role;
            this.CreatedAt = createdAt;
            this.Bio = bio;
            this.Location = location;
            this.Website = website;
            this.Skills = skills;
            this.ProfessionalName = professionalName;
            this.ChannelName = channelName;
        }
    }
}