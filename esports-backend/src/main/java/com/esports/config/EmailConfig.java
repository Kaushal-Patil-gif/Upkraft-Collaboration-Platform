package com.esports.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class EmailConfig {

    @Value("${spring.mail.host}")
    private String host;

    @Value("${spring.mail.port}")
    private int port;

    @Value("${spring.mail.username}")
    private String username;

    @Value("${spring.mail.password}")
    private String password;

    @Bean
    public JavaMailSender javaMailSender() {
        try {
            if (host == null || host.trim().isEmpty()) {
                throw new IllegalArgumentException("Email host configuration is missing");
            }
            if (username == null || username.trim().isEmpty()) {
                throw new IllegalArgumentException("Email username configuration is missing");
            }
            if (password == null || password.trim().isEmpty()) {
                throw new IllegalArgumentException("Email password configuration is missing");
            }
            if (port <= 0 || port > 65535) {
                throw new IllegalArgumentException("Invalid email port configuration");
            }

            JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
            mailSender.setHost(host.trim());
            mailSender.setPort(port);
            mailSender.setUsername(username.trim());
            mailSender.setPassword(password);

            Properties props = mailSender.getJavaMailProperties();
            props.put("mail.transport.protocol", "smtp");
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
            props.put("mail.from", username.trim());
            props.put("mail.debug", "false");

            return mailSender;
        } catch (Exception e) {
            throw new RuntimeException("Failed to configure email sender: " + e.getMessage(), e);
        }
    }
}