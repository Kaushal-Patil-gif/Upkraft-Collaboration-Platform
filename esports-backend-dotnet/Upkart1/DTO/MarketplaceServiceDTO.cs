using Upkart1.Entities.Enums;

namespace Upkart1.DTO
{
    public class MarketplaceServiceDTO
    {
        public long id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public double price { get; set; }
        public int deliveryTime { get; set; }
        public string category { get; set; }
        public bool active { get; set; }
        public string freelancerName { get; set; }
        public string freelancerBio { get; set; }
        public string freelancerLocation { get; set; }
        public string freelancerWebsite { get; set; }
        public string freelancerSkills { get; set; }
        public string freelancerProfessionalName { get; set; }
        public string photo1Url { get; set; }
        public string photo2Url { get; set; }
        public string photo3Url { get; set; }
        public double averageRating { get; set; }
        public long reviewCount { get; set; }
        public VerificationLevel verificationLevel { get; set; }

        public MarketplaceServiceDTO(long id, string title, string description, double price, 
            int deliveryTime, string category, bool active, string freelancerName, 
            string freelancerBio, string freelancerLocation, string freelancerWebsite, 
            string freelancerSkills, string freelancerProfessionalName, string photo1Url, 
            string photo2Url, string photo3Url, double averageRating, long reviewCount, 
            VerificationLevel verificationLevel)
        {
            this.id = id;
            this.title = title;
            this.description = description;
            this.price = price;
            this.deliveryTime = deliveryTime;
            this.category = category;
            this.active = active;
            this.freelancerName = freelancerName;
            this.freelancerBio = freelancerBio;
            this.freelancerLocation = freelancerLocation;
            this.freelancerWebsite = freelancerWebsite;
            this.freelancerSkills = freelancerSkills;
            this.freelancerProfessionalName = freelancerProfessionalName;
            this.photo1Url = photo1Url;
            this.photo2Url = photo2Url;
            this.photo3Url = photo3Url;
            this.averageRating = averageRating;
            this.reviewCount = reviewCount;
            this.verificationLevel = verificationLevel;
        }
    }
}