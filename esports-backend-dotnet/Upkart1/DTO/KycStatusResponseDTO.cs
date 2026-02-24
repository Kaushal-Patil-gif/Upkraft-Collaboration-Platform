namespace Upkart1.DTO
{
    public class KycStatusResponseDTO
    {
        public string VerificationLevel { get; set; }
        public bool EmailVerified { get; set; }
        public bool DocumentUploaded { get; set; }
        public string DocumentType { get; set; }
        public string DocumentStatus { get; set; }

        public KycStatusResponseDTO(string verificationLevel, bool emailVerified, 
            bool documentUploaded, string documentType, string documentStatus)
        {
            VerificationLevel = verificationLevel;
            EmailVerified = emailVerified;
            DocumentUploaded = documentUploaded;
            DocumentType = documentType;
            DocumentStatus = documentStatus;
        }
    }
}