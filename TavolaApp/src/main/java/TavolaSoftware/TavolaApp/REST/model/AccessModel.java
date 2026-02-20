package TavolaSoftware.TavolaApp.REST.model;

import TavolaSoftware.TavolaApp.tools.TipoUsuario;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "verificacoes_pendentes")
public class AccessModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id; // Este será o [ID_DA_VERIFICACAO]

    // Dados do usuário
    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true) // Podemos manter o unique para simplificar
    private String email;

    @Column(nullable = false)
    private String senhaCriptografada;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoUsuario tipo;

    @Column(columnDefinition = "TEXT")
    private String payload; // Aqui guardaremos Endereco, Telefone, dados do restaurante, etc.

    @Column(nullable = true)
    private UUID usuarioId;

    @Column(nullable = false)
    private String codigoVerificacao;

    @Column(nullable = false)
    private LocalDateTime expiracaoCodigo;

    // Getters e Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenhaCriptografada() { return senhaCriptografada; }
    public void setSenhaCriptografada(String senhaCriptografada) { this.senhaCriptografada = senhaCriptografada; }
    public TipoUsuario getTipo() { return tipo; }
    public void setTipo(TipoUsuario tipo) { this.tipo = tipo; }
    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
    public String getCodigoVerificacao() { return codigoVerificacao; }
    public void setCodigoVerificacao(String codigoVerificacao) { this.codigoVerificacao = codigoVerificacao; }
    public LocalDateTime getExpiracaoCodigo() { return expiracaoCodigo; }
    public void setExpiracaoCodigo(LocalDateTime expiracaoCodigo) { this.expiracaoCodigo = expiracaoCodigo; }
    public UUID getUsuarioId() { return usuarioId; }
    public void setUsuarioId(UUID usuarioId) { this.usuarioId = usuarioId; }

}