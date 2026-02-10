package com.esports.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WalletResponseDTO {
    private Double availableBalance;
    private Double escrowBalance;
    private Double totalBalance;
}