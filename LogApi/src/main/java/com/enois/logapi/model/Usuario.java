package com.enois.logapi.model;

import jakarta.persistence.*; 
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {
	
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    private String nome; // Username para exibição

    @Column(nullable = false)
    private String senha; // O hash BCrypt

    private String telefone;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> atributos = new HashMap<>();

    private boolean emailVerificado = false;

    public Usuario() {}

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Por enquanto retornamos lista vazia, depois podemos por roles (ADMIN, USER)
        return List.of(); 
    }

    @Override
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.email; // O nosso "login" é o email
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; } // Podemos mudar se quiser bloquear usuários não verificados

    // --- Getters e Setters Normais ---

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public Map<String, Object> getAtributos() { return atributos; }
    public void setAtributos(Map<String, Object> atributos) { this.atributos = atributos; }

    public boolean isEmailVerificado() { return emailVerificado; }
    public void setEmailVerificado(boolean emailVerificado) { this.emailVerificado = emailVerificado; }
}