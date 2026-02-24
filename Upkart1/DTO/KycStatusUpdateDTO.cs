namespace Upkart1.DTO
{
    public class KycStatusUpdateDTO
    {
        public string KycStatus { get; set; }

        public KycStatusUpdateDTO() { }

        public KycStatusUpdateDTO(string kycStatus)
        {
            KycStatus = kycStatus;
        }
    }
}
