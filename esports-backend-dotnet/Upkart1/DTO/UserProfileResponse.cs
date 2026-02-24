namespace Upkart1.DTO
{
    public class UserProfileResponse
    {
        public long id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public int role { get; set; }
        public string bio { get; set; }
        public string location { get; set; }
        public string website { get; set; }
        public string skills { get; set; }
        public string professionalName { get; set; }
        public string channelName { get; set; }

        public UserProfileResponse(long id, string name, string email, int role,
            string bio, string location, string website, string skills,
            string professionalName, string channelName)
        {
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
            this.bio = bio;
            this.location = location;
            this.website = website;
            this.skills = skills;
            this.professionalName = professionalName;
            this.channelName = channelName;
        }
    }
}
