namespace Upkart1.DTO
{
    public class KycDocumentResponseDTO
    {
        public long userId { get; set; }
        public string userName { get; set; }
        public string userEmail { get; set; }
        public string documentType { get; set; }
        public string documentUrl { get; set; }
        public string uploadedAt { get; set; }
        public string status { get; set; }

        public KycDocumentResponseDTO(long userId, string userName, string userEmail, 
            string documentType, string documentUrl, string uploadedAt, string status)
        {
            this.userId = userId;
            this.userName = userName;
            this.userEmail = userEmail;
            this.documentType = documentType;
            this.documentUrl = documentUrl;
            this.uploadedAt = uploadedAt;
            this.status = status;
        }
    }
}