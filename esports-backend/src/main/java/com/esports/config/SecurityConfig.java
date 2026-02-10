package com.esports.config;

import com.esports.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/test/**", "/ws/**", "/api/contact").permitAll()
                .requestMatchers("/api/services").permitAll() // Public service listing
                .requestMatchers("/api/reviews/service/**").permitAll() // Public service reviews
                
                // Admin endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // Freelancer endpoints
                .requestMatchers("/api/freelancer/**").hasAnyRole("FREELANCER", "ADMIN")
                .requestMatchers("/api/services/**").hasAnyRole("FREELANCER", "ADMIN")
                
                // Creator endpoints
                .requestMatchers("/api/projects/create", "/api/projects/*/hire").hasAnyRole("CREATOR", "ADMIN")
                
                // KYC endpoints 
                .requestMatchers("/api/kyc/**").authenticated()
                
                // Payment endpoints 
                .requestMatchers("/api/payments/**").authenticated()
                .requestMatchers("/api/wallet/**").authenticated()
                
                // Project endpoints 
                .requestMatchers("/api/projects/**").authenticated()
                
                // User profile endpoints
                .requestMatchers("/api/users/**").authenticated()
                
                // Dashboard endpoints
                .requestMatchers("/api/dashboard/**").authenticated()
                
                // Marketplace and reviews endpoints
                .requestMatchers("/api/marketplace/**").authenticated()
                .requestMatchers("/api/reviews/**").authenticated()
                
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}