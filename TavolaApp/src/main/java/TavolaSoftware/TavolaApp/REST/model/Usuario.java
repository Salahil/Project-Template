package TavolaSoftware.TavolaApp.REST.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import TavolaSoftware.TavolaApp.tools.Endereco;
import TavolaSoftware.TavolaApp.tools.TipoUsuario;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuario_table")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "usuario_id")
    private UUID id;

    @Column(name = "nome_usuario", nullable = false)
    private String nome;

    @Embedded
    private Endereco endereco;

    @Column(name = "email_usuario", nullable = false, unique = true)
    private String email;

    @Column(name = "senha_usuario", nullable = false)
    private String senha;

    @Column(name = "tipo_usuario", nullable = false)
    private TipoUsuario tipo;

    @Column(name = "telefone_usuario") // <<< NOVO CAMPO: Telefone
    private String telefone;

    @Column(name = "imagem_usuario")
    private String imagem;

    @Column(name = "apresentacao_usuario")
    private String imagemPrincipal;

    @Column(name = "imagem_repositorio_usuario") // Explicitando o nome da coluna
    private UUID idImagem; // Este campo parece ser um identificador para uma imagem num repositório externo
    
    @Column(name = "codigo_verificacao") // <<< NOVO CAMPO
    private String codigoVerificacao;

    @Column(name = "expiracao_codigo") // <<< NOVO CAMPO
    private LocalDateTime expiracaoCodigo;
    
    @Column(name = "email_verificado") // <<< NOVO CAMPO (útil para o futuro)
    private boolean emailVerificado = false;

    // Getters e Setters

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public TipoUsuario getTipo() { return tipo; }
    public void setTipo(TipoUsuario tipo) { this.tipo = tipo; }

    // Getter e Setter para o novo campo telefone
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getImagem() { return imagem; }
    public void setImagem(String imagem) { this.imagem = imagem; }
    
    public String getImagemPrincipal() { return imagemPrincipal; }
    public void setImagemPrincipal(String imagemPrincipal) { this.imagemPrincipal = imagemPrincipal; }
    
    public UUID getIdImagem() { return idImagem; }
    public void setIdImagem(UUID idImagem) { this.idImagem = idImagem; }
    
    public String getCodigoVerificacao() { return codigoVerificacao; }
    public void setCodigoVerificacao(String codigoVerificacao) { this.codigoVerificacao = codigoVerificacao; }
    
    public LocalDateTime getExpiracaoCodigo() { return expiracaoCodigo; }
    public void setExpiracaoCodigo(LocalDateTime expiracaoCodigo) { this.expiracaoCodigo = expiracaoCodigo; }

    public boolean isEmailVerificado() { return emailVerificado; }
    public void setEmailVerificado(boolean emailVerificado) { this.emailVerificado = emailVerificado; }
    
    public String getEnderecoResumido() {
        if (this.endereco == null) {
            return "Endereço não informado";
        }

        List<String> partes = new ArrayList<>();
        if (this.endereco.getBairro() != null && !this.endereco.getBairro().isBlank()) {
            partes.add(this.endereco.getBairro());
        }
        if (this.endereco.getCidade() != null && !this.endereco.getCidade().isBlank()) {
            partes.add(this.endereco.getCidade());
        }

        if (partes.isEmpty()) {
            return "Endereço não informado";
        }

        return String.join(", ", partes);
    }
    
}