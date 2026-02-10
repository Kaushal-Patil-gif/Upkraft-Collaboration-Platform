package com.esports.dto;

public class KycStatusUpdateDTO {
    private String kycStatus;

    public KycStatusUpdateDTO() {}

    public KycStatusUpdateDTO(String kycStatus) {
        this.kycStatus = kycStatus;
    }

    public String getKycStatus() {
        return kycStatus;
    }

    public void setKycStatus(String kycStatus) {
        this.kycStatus = kycStatus;
    }
}