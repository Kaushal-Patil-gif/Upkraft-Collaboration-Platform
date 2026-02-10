package com.esports.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class PaymentHistoryDTO {
    private Long id;
    private String title;
    private Double amount;
    private LocalDateTime date;
    private String paymentId;
    private String status;
    private String type;
    private String description;
    private String freelancerName;
    private String creatorName;
    private String bankAccount;
    private String ifscCode;
}