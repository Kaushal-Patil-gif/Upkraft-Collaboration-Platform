namespace Upkart1.DTO
{
    public class WithdrawalRequestDTO
    {
        public double amount { get; set; }
        public double Amount => amount; // PascalCase accessor for compatibility
        public string bankAccount { get; set; }
        public string BankAccount => bankAccount; // PascalCase accessor for compatibility
        public string ifscCode { get; set; }
        public string IfscCode => ifscCode; // PascalCase accessor for compatibility
    }
}