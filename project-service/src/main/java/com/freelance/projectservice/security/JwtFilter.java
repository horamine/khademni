package com.freelance.projectservice.security;

import com.freelance.projectservice.service.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,\n                                    HttpServletResponse response,\n                                    FilterChain filterChain)\n            throws ServletException, IOException {\n
        String authHeader = request.getHeader("Authorization");\n
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {\n            filterChain.doFilter(request, response);\n            return;\n        }\n
        String token = authHeader.substring(7);\n
        try {\n            Claims claims = jwtService.extractClaims(token);\n            String email = claims.getSubject();\n            String role = claims.get("role", String.class);\n
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {\n                UsernamePasswordAuthenticationToken authentication =\n                        new UsernamePasswordAuthenticationToken(\n                                email,\n                                null,\n                                List.of(new SimpleGrantedAuthority("ROLE_" + role))\n                        );\n                SecurityContextHolder.getContext().setAuthentication(authentication);\n            }\n
        } catch (Exception e) {\n            System.out.println("JWT ERROR: " + e.getClass().getName() + " - " + e.getMessage());\n            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);\n            return;\n        }\n
        filterChain.doFilter(request, response);\n    }\n}