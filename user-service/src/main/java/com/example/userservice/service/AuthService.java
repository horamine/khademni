package com.example.userservice.service;

import com.example.userservice.dto.AuthResponse;
import com.example.userservice.dto.LoginRequest;
import com.example.userservice.dto.RegisterRequest;
import com.example.userservice.entity.Client;
import com.example.userservice.entity.Freelancer;
import com.example.userservice.entity.Role;
import com.example.userservice.exception.EmailAlreadyUsedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.userservice.entity.User;
import com.example.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyUsedException();
        }

        Role role = Role.valueOf(request.getRole().toUpperCase());
        User saved;

        if (role == Role.FREELANCER) {
            Freelancer freelancer = new Freelancer();
            freelancer.setName(request.getName());
            freelancer.setEmail(request.getEmail());
            freelancer.setPassword(passwordEncoder.encode(request.getPassword()));
            freelancer.setRole(role);
            freelancer.setSkills(request.getSkills());
            freelancer.setExperienceYears(request.getExperienceYears() != null ? request.getExperienceYears() : 0);
            freelancer.setAvailability(request.getAvailability() != null ? request.getAvailability() : 0);
            saved = userRepository.save(freelancer);

        } else if (role == Role.CLIENT) {
            Client client = new Client();
            client.setName(request.getName());
            client.setEmail(request.getEmail());
            client.setPassword(passwordEncoder.encode(request.getPassword()));
            client.setRole(role);
            client.setCompany(request.getCompany());
            client.setBudgetRange(request.getBudgetRange());
            saved = userRepository.save(client);

        } else {
            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(role);
            saved = userRepository.save(user);
        }

        String token = jwtService.generateToken(saved.getEmail(), saved.getRole().name(), saved.getId(), saved.getName());
        return new AuthResponse(token, saved.getId(), saved.getEmail(), saved.getRole().name(), saved.getName());
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé !"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect !");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name(), user.getId(), user.getName());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole().name(), user.getName());
    }

}