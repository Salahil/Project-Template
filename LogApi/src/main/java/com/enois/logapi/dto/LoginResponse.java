package com.enois.logapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Map;
import java.util.UUID;

public class LoginResponse {
    
    @JsonIgnore
    private String token; 
    
    @JsonIgnore
    private String refreshToken; 

    private UUID userId;
    private String nome;
    private String email;
    private Map<String, Object> dadosExtras;

    public LoginResponse(String token, String refreshToken, UUID userId, String nome, String email, Map<String, Object> dadosExtras) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.nome = nome;
        this.email = email;
        this.dadosExtras = dadosExtras;
    }

    // Getters
    public String getToken() { return token; }
    public String getRefreshToken() { return refreshToken; }
    public UUID getUserId() { return userId; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public Map<String, Object> getDadosExtras() { return dadosExtras; }
}