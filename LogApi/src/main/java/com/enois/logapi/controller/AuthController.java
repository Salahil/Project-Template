package com.enois.logapi.controller;

import com.enois.logapi.dto.LoginRequest;
import com.enois.logapi.dto.RegisterRequest;
import com.enois.logapi.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
// @CrossOrigin("*") // Descomente se o Angular der erro de CORS no início
public class AuthController {

    @Autowired
    private AuthService service;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            var usuarioCriado = service.registrar(request);
            return ResponseEntity.ok("Usuário criado com sucesso! ID: " + usuarioCriado.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            var response = service.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Retorna 403/401 se a senha estiver errada
            return ResponseEntity.status(401).body("E-mail ou senha inválidos");
        }
    }
}