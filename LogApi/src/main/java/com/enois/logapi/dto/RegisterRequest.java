package com.enois.logapi.dto;

import java.util.Map;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
	
	@NotBlank(message = "O nome é obrigatório")
	private String nome;
	
	@Email(message = "E-mail inválido")
    @NotBlank(message = "O e-mail é obrigatório")
    private String email;
    
	@Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
	private String senha;
    private String telefone;
    
    private String recaptchaToken;
    
    private Map<String, Object> dadosExtras;

    // -- Getters e Setters --

    public String getRecaptchaToken() { return recaptchaToken; }
    public void setRecaptchaToken(String recaptchaToken) { this.recaptchaToken = recaptchaToken; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public Map<String, Object> getDadosExtras() { return dadosExtras; }
    public void setDadosExtras(Map<String, Object> dadosExtras) { this.dadosExtras = dadosExtras; }
}