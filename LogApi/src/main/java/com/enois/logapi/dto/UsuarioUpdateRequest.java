package com.enois.logapi.dto;

import java.util.Map;

public class UsuarioUpdateRequest {
    private String nome;
    private String telefone;
    private Map<String, Object> dadosExtras;

    // Getters e Setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public Map<String, Object> getDadosExtras() { return dadosExtras; }
    public void setDadosExtras(Map<String, Object> dadosExtras) { this.dadosExtras = dadosExtras; }
}