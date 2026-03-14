package com.enois.logapi.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
@Entity(name = "refresh_tokens")
public class RefreshToken {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private Usuario usuario;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private Instant dataExpiracao;
    
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario id) { this.usuario = id; }
    public String getToken() { return token; }
    public void setToken(String id) { this.token = id; }
    public Instant getDataExpiracao() { return dataExpiracao; }
    public void setDataExpiracao(Instant id) { this.dataExpiracao = id; }
}