package com.esports.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private int role;
    private String bio;
    private String location;
    private String website;
    private String skills;
    private String professionalName;
    private String channelName;
}