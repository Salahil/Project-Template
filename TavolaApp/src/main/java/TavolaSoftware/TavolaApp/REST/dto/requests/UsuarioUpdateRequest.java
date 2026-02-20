package TavolaSoftware.TavolaApp.REST.dto.requests;

import TavolaSoftware.TavolaApp.tools.Endereco;

// Este DTO representa os dados que um usuário pode enviar para atualizar seu perfil.
public class UsuarioUpdateRequest {

    private String nome;
    private Endereco endereco;
    private String telefone;
    
    // As imagens serão enviadas como strings Base64
    private String imagem; // Imagem de perfil
    private String imagemBackground; // Imagem de capa

    // Getters e Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
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
        return imagemBackground;
    }

    public void setImagemBackground(String imagemBackground) {
        this.imagemBackground = imagemBackground;
    }
}