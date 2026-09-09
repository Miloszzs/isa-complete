package com.example.isa.controllers;

import com.example.isa.entities.Role;
import com.example.isa.models.AuthResponse;
import com.example.isa.models.LoginRequest;
import com.example.isa.repositories.IUserRepository;
import com.example.isa.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    @Transactional(readOnly = true)
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody @Valid LoginRequest request,
            BindingResult result) {

        if (result.hasErrors()) {

            return ResponseEntity
                    .badRequest()
                    .body("Neispravni podaci za prijavu");
        }

        var user = userRepository
                .findByEmail(request.getEmail());

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Pogresan email ili lozinka");
        }

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Pogresan email ili lozinka");
        }

        String accessToken =
                jwtService.generateAccessToken(user);

        List<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .toList();

        return ResponseEntity.ok(
                AuthResponse.builder()
                        .accessToken(accessToken)
                        .tokenType("Bearer")
                        .expiresIn(
                                jwtService.getAccessTokenExpiration()
                        )
                        .userId(user.getId())
                        .email(user.getEmail())
                        .roles(roles)
                        .build()
        );
    }


    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(
            @RequestHeader(
                    value = "Authorization",
                    required = false
            )
            String authorizationHeader) {

        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("JWT token nije prosledjen");
        }

        String token =
                authorizationHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("JWT token nije validan");
        }

        return ResponseEntity.ok(
                Map.of(
                        "valid", true,
                        "email",
                        jwtService.extractEmail(token),
                        "roles",
                        jwtService.extractRoles(token)
                )
        );
    }
}