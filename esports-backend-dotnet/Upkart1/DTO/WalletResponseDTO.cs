namespace Upkart1.DTO
{
    public class WalletResponseDTO
    {
        public double availableBalance { get; set; }
        public double escrowBalance { get; set; }
        public double totalBalance { get; set; }

        public WalletResponseDTO() { }

        public WalletResponseDTO(double availableBalance, double escrowBalance, double totalBalance)
        {
            this.availableBalance = availableBalance;
            this.escrowBalance = escrowBalance;
            this.totalBalance = totalBalance;
        }
    }
}