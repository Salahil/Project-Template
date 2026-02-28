package com.enois.logapi.dto;

import java.util.Map;
import java.util.UUID;

public class LoginResponse {
    private String token; // O JWT
    private UUID userId;
    private String nome;
    private String email;
    private Map<String, Object> dadosExtras; // Devolvemos os dados personalizados também

    // Construtor completo
    public LoginResponse(String token, UUID userId, String nome, String email, Map<String, Object> dadosExtras) {
        this.token = token;
        this.userId = userId;
        this.nome = nome;
        this.email = email;
        this.dadosExtras = dadosExtras;
    }

    // Getters
    public String getToken() { return token; }
    public UUID getUserId() { return userId; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public Map<String, Object> getDadosExtras() { return dadosExtras; }
}