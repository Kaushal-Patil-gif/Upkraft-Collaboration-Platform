package com.esports.validation;

import com.esports.dto.RegisterRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, RegisterRequest> {

    @Override
    public void initialize(PasswordMatches constraintAnnotation) {
    }

    @Override
    public boolean isValid(RegisterRequest request, ConstraintValidatorContext context) {
        System.out.println("PasswordMatches validation - password: " + (request.getPassword() != null ? "[PRESENT]" : "null") + 
                          ", confirmPassword: " + (request.getConfirmPassword() != null ? "[PRESENT]" : "null")); // Debug log
        
        if (request.getPassword() == null || request.getConfirmPassword() == null) {
            return true; 
        }
        
        boolean isValid = request.getPassword().equals(request.getConfirmPassword());
        System.out.println("Passwords match: " + isValid); 
        
        if (!isValid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Passwords do not match")
                   .addPropertyNode("confirmPassword")
                   .addConstraintViolation();
        }
        
        return isValid;
    }
}