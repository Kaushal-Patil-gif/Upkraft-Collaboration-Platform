package com.esports.dto;

import lombok.Data;

@Data
public class WithdrawalRequestDTO {
    private Double amount;
    private String bankAccount;
    private String ifscCode;
}