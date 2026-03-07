package com.enois.logapi.controller;

import com.enois.logapi.dto.ApiResponse;
import com.enois.logapi.dto.LoginRequest;
import com.enois.logapi.dto.LoginResponse;
import com.enois.logapi.dto.RegisterRequest;
import com.enois.logapi.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService service;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@RequestBody RegisterRequest request) {
        // Se o e-mail já existir, o Service lança RuntimeException e o Handler Global trata!
        var usuarioCriado = service.registrar(request);
        return ResponseEntity.ok(new ApiResponse<>("Usuário criado com sucesso!", "Registro OK"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        // Se a senha estiver errada, o AuthenticationManager lança BadCredentialsException
        // e o Handler Global devolve "Credenciais inválidas" automaticamente.
        var response = service.login(request);
        return ResponseEntity.ok(new ApiResponse<>(response, "Login realizado com sucesso"));
    }
}