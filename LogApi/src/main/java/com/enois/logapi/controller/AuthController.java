package com.enois.logapi.controller;

import com.enois.logapi.dto.ApiResponse;
import com.enois.logapi.dto.LoginRequest;
import com.enois.logapi.dto.LoginResponse;
import com.enois.logapi.dto.RegisterRequest;
import com.enois.logapi.service.AuthService;
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

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
    	service.registrar(request, request.getRecaptchaToken());
    	return ResponseEntity.ok(new ApiResponse<>("Sucesso", "Usuário criado com sucesso"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        
    	LoginResponse loginResponse = service.login(request, request.getRecaptchaToken());
        
    	String token = loginResponse.getToken(); 

        ResponseCookie cookie = ResponseCookie.from("logapi-token", token)
                .httpOnly(true)      
                .secure(true)        
                .path("/")           
                .maxAge(Duration.ofDays(1)) 
                .sameSite("Lax")    
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new ApiResponse<>(loginResponse, "Login realizado com sucesso"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("logapi-token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new ApiResponse<>("Sucesso", "Logout realizado"));
    }

}