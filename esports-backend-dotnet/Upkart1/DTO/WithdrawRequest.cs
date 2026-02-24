namespace Upkart1.DTO
{
    public class WithdrawRequest
    {
        public double Amount { get; set; }
        public string BankAccount { get; set; }
        public string IfscCode { get; set; }
    }
}