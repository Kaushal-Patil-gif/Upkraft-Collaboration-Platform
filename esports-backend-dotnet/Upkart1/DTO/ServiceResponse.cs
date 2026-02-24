namespace Upkart1.DTO
{
    public class ServiceResponse
    {
        public long id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public double price { get; set; }
        public int deliveryTime { get; set; }
        public string category { get; set; }
        public bool active { get; set; }
        public string freelancerName { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
        public string photo1Url { get; set; }
        public string photo2Url { get; set; }
        public string photo3Url { get; set; }

        public ServiceResponse(long id, string title, string description, double price,
            int deliveryTime, string category, bool active, string freelancerName,
            DateTime createdAt, DateTime updatedAt, string photo1Url,
            string photo2Url, string photo3Url)
        {
            this.id = id;
            this.title = title;
            this.description = description;
            this.price = price;
            this.deliveryTime = deliveryTime;
            this.category = category;
            this.active = active;
            this.freelancerName = freelancerName;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
            this.photo1Url = photo1Url;
            this.photo2Url = photo2Url;
            this.photo3Url = photo3Url;
        }
    }
}
