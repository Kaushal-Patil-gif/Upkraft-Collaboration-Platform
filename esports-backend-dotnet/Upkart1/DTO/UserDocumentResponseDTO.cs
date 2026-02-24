namespace Upkart1.DTO
{
    public class UserDocumentResponseDTO
    {
        public string documentType { get; set; }
        public string documentUrl { get; set; }
        public DateTime uploadedAt { get; set; }
        public string status { get; set; }

        public UserDocumentResponseDTO() { }

        public UserDocumentResponseDTO(string documentType, string documentUrl, DateTime uploadedAt, string status)
        {
            this.documentType = documentType;
            this.documentUrl = documentUrl;
            this.uploadedAt = uploadedAt;
            this.status = status;
        }
    }
}
