namespace Upkart1.DTO
{
    public class PaymentHistoryDTO
    {
        public long id { get; set; }
        public string title { get; set; }
        public double amount { get; set; }
        public DateTime date { get; set; }
        public string paymentId { get; set; }
        public string status { get; set; }
        public string type { get; set; }
        public string description { get; set; }
        public string freelancerName { get; set; }
        public string creatorName { get; set; }
        public string bankAccount { get; set; }
        public string ifscCode { get; set; }

        public PaymentHistoryDTO(long id, string title, double amount, DateTime date, 
            string paymentId, string status, string type, string description, 
            string freelancerName, string creatorName, string bankAccount, string ifscCode)
        {
            this.id = id;
            this.title = title;
            this.amount = amount;
            this.date = date;
            this.paymentId = paymentId;
            this.status = status;
            this.type = type;
            this.description = description;
            this.freelancerName = freelancerName;
            this.creatorName = creatorName;
            this.bankAccount = bankAccount;
            this.ifscCode = ifscCode;
        }
    }
}