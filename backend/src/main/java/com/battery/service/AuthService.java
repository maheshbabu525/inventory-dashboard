package com.battery.service;

import com.battery.config.JwtTokenProvider;
import com.battery.dto.LoginRequest;
import com.battery.dto.LoginResponse;
import com.battery.entity.User;
import com.battery.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // For demo: using bcrypt hash $2a$10$V0fVz3oLGaIdPq9XdqQT4eWE7E4VH0pYCy00B0T/m1CRxm9d4.Qly
        // Password: 123456
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtTokenProvider.generateToken(user.getUsername(), user.getRole().toString());
        return new LoginResponse(token, user.getRole().toString(), user.getRegion());
    }
}
