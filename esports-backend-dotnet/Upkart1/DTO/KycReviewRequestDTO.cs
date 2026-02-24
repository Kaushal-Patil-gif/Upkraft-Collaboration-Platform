namespace Upkart1.DTO
{
    public class KycReviewRequestDTO
    {
        public long userId { get; set; }
        public string action { get; set; }
        public string Action => action; // PascalCase accessor for compatibility
        public string remarks { get; set; }
    }
}