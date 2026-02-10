package com.esports.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class UserProfileUpdateDTO {
    @Pattern(regexp = "^[a-zA-Z]+(\s[a-zA-Z]+)?$", message = "Name must contain only alphabets and at most one space")
    private String name;
    
    @Email(message = "Email must be valid")
    private String email;
    
    @Pattern(
    	    regexp = "^(\\S+\\s+){0,29}\\S*$",
    	    message = "Bio must not exceed 30 words"
    	)
    private String bio;
    
    private String location;
    
    @URL(message = "Website must be a valid URL")
    private String website;
    
    private String skills;
    
    private String professionalName;
    private String channelName;
}