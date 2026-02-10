package com.esports.service;

import com.esports.dto.*;
import com.esports.entity.User;
import com.esports.entity.UserProfile;
import com.esports.repository.UserRepository;
import com.esports.repository.UserProfileRepository;
import com.esports.security.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Collections;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        System.out.println("Register request: " + request); // Debug log
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        try {
            if (request.getEmail().contains("@admin")) {
                user.setRole(User.Role.ADMIN);
            } else if (request.getRole() != null && !request.getRole().trim().isEmpty()) {
                user.setRole(User.Role.valueOf(request.getRole().trim()));
            } else {
                throw new IllegalArgumentException("Role is required");
            }
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("Role is required")) {
                throw e;
            }
            throw new IllegalArgumentException("Invalid role: " + request.getRole());
        }

        user = userRepository.save(user);
        user.setHasSelectedRole(true);
        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), token, user.getCreatedAt());
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("No account found with this email address");
        }
        
        User user = userOpt.get();
        
        // (Google OAuth user)
        if (user.getGoogleId() != null) {
            throw new IllegalArgumentException("Please use Google Sign-In for this account");
        }
        
        // Check password for regular users
        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Incorrect password");
        }
        
        if (!user.isActive()) {
            throw new IllegalArgumentException("Account has been deactivated");
        }
        
        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), token, user.getCreatedAt());
    }

    public AuthResponse googleAuth(GoogleAuthRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

            GoogleIdToken idToken;
            try {
                idToken = verifier.verify(request.getToken());
            } catch (Exception verificationError) {
                throw new RuntimeException("Google authentication failed");
            }
            
            if (idToken == null) {
                throw new RuntimeException("Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String googleId = payload.getSubject();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            Optional<User> existingUser = userRepository.findByGoogleId(googleId);
            User user;

            if (existingUser.isPresent()) {
                user = existingUser.get();
                if (!user.isActive()) {
                    throw new RuntimeException("Account has been deactivated");
                }
            } else {
                Optional<User> emailUser = userRepository.findByEmail(email);
                if (emailUser.isPresent()) {
                    user = emailUser.get();
                    if (!user.isActive()) {
                        throw new RuntimeException("Account has been deactivated");
                    }
                    user.setGoogleId(googleId);
                    user = userRepository.save(user);
                } else {
                    user = new User();
                    user.setName(name);
                    user.setEmail(email);
                    user.setGoogleId(googleId);
                    user.setHasSelectedRole(false);
                    
                    if (email.contains("@admin")) {
                        user.setRole(User.Role.ADMIN);
                        user.setHasSelectedRole(true);
                    } else {
                        user.setRole(User.Role.CREATOR);
                    }
                    user = userRepository.save(user);
                }
            }

            String token = jwtUtil.generateToken(user.getEmail());
            return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), token, user.getCreatedAt(), user.isHasSelectedRole());

        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword() != null ? user.getPassword() : "",
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }

    public UserResponseDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        
        UserResponseDTO response = new UserResponseDTO();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        response.setCreatedAt(user.getCreatedAt());
        
        if (profile != null) {
            response.setBio(profile.getBio());
            response.setLocation(profile.getLocation());
            response.setWebsite(profile.getWebsite());
            response.setSkills(profile.getSkills());
            response.setProfessionalName(profile.getProfessionalName());
            response.setChannelName(profile.getChannelName());
        }
        
        return response;
    }

    @Transactional
    public UserResponseDTO updateUserProfile(String email, UserProfileUpdateDTO updateData) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        if (updateData.getName() != null) {
            user.setName(updateData.getName());
        }
        
        // email updates for admin users
        if (updateData.getEmail() != null && !updateData.getEmail().equals(user.getEmail())) {
            // Check if user is admin 
            if (user.getRole() == User.Role.ADMIN) {
                // Check if email already exists
                if (userRepository.existsByEmail(updateData.getEmail())) {
                    throw new IllegalArgumentException("Email already exists");
                }
                user.setEmail(updateData.getEmail());
            }
        }
        
        User updatedUser = userRepository.save(user);
        
        UserProfile profile = userProfileRepository.findByUser(user)
            .orElse(new UserProfile());
        
        if (profile.getUser() == null) {
            profile.setUser(user);
        }
        
        if (updateData.getBio() != null) {
            profile.setBio(updateData.getBio());
        }
        if (updateData.getLocation() != null) {
            profile.setLocation(updateData.getLocation());
        }
        if (updateData.getWebsite() != null) {
            profile.setWebsite(updateData.getWebsite());
        }
        if (updateData.getSkills() != null) {
            profile.setSkills(updateData.getSkills());
        }
        if (updateData.getProfessionalName() != null) {
            profile.setProfessionalName(updateData.getProfessionalName());
        }
        if (updateData.getChannelName() != null) {
            profile.setChannelName(updateData.getChannelName());
        }
        
        UserProfile updatedProfile = userProfileRepository.save(profile);
        
        UserResponseDTO response = new UserResponseDTO();
        response.setId(updatedUser.getId());
        response.setName(updatedUser.getName());
        response.setEmail(updatedUser.getEmail());
        response.setRole(updatedUser.getRole().name());
        response.setCreatedAt(updatedUser.getCreatedAt());
        response.setBio(updatedProfile.getBio());
        response.setLocation(updatedProfile.getLocation());
        response.setWebsite(updatedProfile.getWebsite());
        response.setSkills(updatedProfile.getSkills());
        response.setProfessionalName(updatedProfile.getProfessionalName());
        response.setChannelName(updatedProfile.getChannelName());
        
        return response;
    }

    @Transactional
    public AuthResponse updateUserRole(UpdateRoleRequest request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        if (user.getGoogleId() == null) {
            throw new IllegalArgumentException("Role update only allowed for Google users");
        }
        
        try {
            user.setRole(User.Role.valueOf(request.getRole()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + request.getRole());
        }
        
        user = userRepository.save(user);
        user.setHasSelectedRole(true);
        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail());
        
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), token, user.getCreatedAt());
    }
}