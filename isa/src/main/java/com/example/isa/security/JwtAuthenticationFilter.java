package com.example.isa.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            Claims claims = jwtService.extractClaims(header.substring(7));
            String email = claims.getSubject();
            List<?> roles = claims.get("roles", List.class);

            if (email == null || email.isBlank()
                    || claims.getExpiration() == null
                    || !claims.getExpiration().after(new Date())
                    || roles == null) {
                throw new IllegalArgumentException("Neispravni JWT podaci");
            }

            var authorities = new ArrayList<SimpleGrantedAuthority>();

            for (Object role : roles) {
                if (!(role instanceof String name) || name.isBlank()) {
                    throw new IllegalArgumentException("Neispravna JWT uloga");
                }

                authorities.add(
                        new SimpleGrantedAuthority("ROLE_" + name)
                );
            }

            var authentication = new UsernamePasswordAuthenticationToken(
                    email, null, authorities
            );

            var context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

        } catch (JwtException | IllegalArgumentException e) {
            SecurityContextHolder.clearContext();

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("text/plain;charset=UTF-8");
            response.getWriter().write("JWT token nije validan");
            return;
        }

        filterChain.doFilter(request, response);
    }
}