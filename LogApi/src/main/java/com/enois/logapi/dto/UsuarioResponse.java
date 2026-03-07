package com.enois.logapi.dto;

import com.enois.logapi.model.Usuario;
import java.util.Map;
import java.util.UUID;

public class UsuarioResponse {
    private UUID id;
    private String email;
    private String nome;
    private String telefone;
    private Map<String, Object> atributos;

    // Construtor que converte a Entidade no DTO automaticamente
    public UsuarioResponse(Usuario usuario) {
        this.id = usuario.getId();
        this.email = usuario.getEmail();
        this.nome = usuario.getNome();
        this.telefone = usuario.getTelefone();
        this.atributos = usuario.getAtributos();
    }

    // Getters
    public UUID getId() { return id; }
    public String getEmail() { return email; }
    public String getNome() { return nome; }
    public String getTelefone() { return telefone; }
    public Map<String, Object> getAtributos() { return atributos; }
}