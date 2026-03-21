package com.enois.logapi.controller;

import com.enois.logapi.dto.ApiResponse;
import com.enois.logapi.dto.GoogleLoginRequest;
import com.enois.logapi.dto.LoginRequest;
import com.enois.logapi.dto.LoginResponse;
import com.enois.logapi.dto.RegisterRequest;
import com.enois.logapi.model.RefreshToken;
import com.enois.logapi.model.Usuario;
import com.enois.logapi.security.JwtUtil;
import com.enois.logapi.service.AuthService;
import com.enois.logapi.service.RefreshTokenService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService service;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private JwtUtil jwtUtil;

    private void anexarCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        ResponseCookie jwtCookie = ResponseCookie.from("logapi-token", accessToken)
                .httpOnly(true)
                .secure(true)    // Mantenha true se estiver usando HTTPS
                .path("/")
                .maxAge(Duration.ofHours(1))
                .sameSite("None") // "None" é necessário para cross-site em localhost HTTPS
                .build();
        
        ResponseCookie refreshCookie = ResponseCookie.from("logapi-refresh", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/auth/refresh")
                .maxAge(Duration.ofDays(7))
                .sameSite("None")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        service.registrar(request, request.getRecaptchaToken());
        return ResponseEntity.ok(new ApiResponse<>("Sucesso", "Usuário criado com sucesso"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        LoginResponse loginResponse = service.login(request, request.getRecaptchaToken());
        anexarCookies(response, loginResponse.getToken(), loginResponse.getRefreshToken());
        return ResponseEntity.ok(new ApiResponse<>(loginResponse, "Login realizado com sucesso"));
    }

    @PostMapping("/login/google")
    public ResponseEntity<ApiResponse<?>> loginComGoogle(@RequestBody GoogleLoginRequest request, HttpServletResponse response) {
        try {
            LoginResponse loginResponse = service.loginComGoogle(request);
            anexarCookies(response, loginResponse.getToken(), loginResponse.getRefreshToken());
            return ResponseEntity.ok(new ApiResponse<>(loginResponse, "Login com Google realizado com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Erro no login Google: " + e.getMessage()));
        }
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@CookieValue(name = "logapi-refresh", required = false) String requestRefreshToken, HttpServletResponse response) {
        if (requestRefreshToken == null || requestRefreshToken.isEmpty()) {
            return ResponseEntity.status(401).body(new ApiResponse<>(false, "Refresh Token ausente no cookie."));
        }

        try {
            RefreshToken tokenNoBanco = refreshTokenService.buscarPorToken(requestRefreshToken)
                    .orElseThrow(() -> new RuntimeException("Refresh token não encontrado!"));

            refreshTokenService.verificarExpiracao(tokenNoBanco);

            Usuario usuario = tokenNoBanco.getUsuario();
            String novoAccessToken = jwtUtil.generateAccessToken(usuario.getEmail());

            ResponseCookie jwtCookie = ResponseCookie.from("logapi-token", novoAccessToken)
                    .httpOnly(true).secure(true).path("/").maxAge(Duration.ofHours(1)).sameSite("Lax").build();
            
            response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

            return ResponseEntity.ok(new ApiResponse<>("Sucesso", "Token renovado com sucesso!"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(new ApiResponse<>(false, e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie limpaJwt = ResponseCookie.from("logapi-token", "").httpOnly(true).secure(true).path("/").maxAge(0).build();
        ResponseCookie limpaRefresh = ResponseCookie.from("logapi-refresh", "").httpOnly(true).secure(true).path("/auth/refresh").maxAge(0).build();

        response.addHeader(HttpHeaders.SET_COOKIE, limpaJwt.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, limpaRefresh.toString());

        return ResponseEntity.ok(new ApiResponse<>("Sucesso", "Logout realizado"));
    }
}