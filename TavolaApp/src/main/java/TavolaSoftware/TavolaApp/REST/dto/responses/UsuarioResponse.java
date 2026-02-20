package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.Usuario;
import TavolaSoftware.TavolaApp.tools.Endereco;
import TavolaSoftware.TavolaApp.tools.TipoUsuario;
import java.util.UUID;

public class UsuarioResponse {

    private UUID id;
    private String nome;
    private String email;
    private TipoUsuario tipo;
    private Endereco endereco;
    private String telefone;
    private String imagem;
    private String imagemPrincipal;

    public UsuarioResponse(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.tipo = usuario.getTipo();
        this.endereco = usuario.getEndereco();
        this.telefone = usuario.getTelefone();
        this.imagem = usuario.getImagem();
        this.imagemPrincipal = usuario.getImagemPrincipal();
    }

    // <<< INÍCIO DOS GETTERS E SETTERS ADICIONADOS >>>

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public TipoUsuario getTipo() {
        return tipo;
    }

    public void setTipo(TipoUsuario tipo) {
        this.tipo = tipo;
    }

    public Endereco getEndereco() {
        return endereco;
    }

    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getImagem() {
        return imagem;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

    public String getImagemPrincipal() {
        return imagemPrincipal;
    }

    public void setImagemPrncipal(String imagemBackground) {
        this.imagemPrincipal = imagemBackground;
    }
}