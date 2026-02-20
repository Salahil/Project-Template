package TavolaSoftware.TavolaApp.REST.dto.requests;

import TavolaSoftware.TavolaApp.tools.Endereco;

public class ClienteUpdateRequest {
    private String nome;
    private String email; // Cuidado ao permitir alteração de email
    private String senha; // Cuidado ao permitir alteração de senha
    private Endereco endereco;
    private String telefone; // <<< NOVO CAMPO
    private String imagemPerfilBase64;
    private String imagemBackgroundBase64;

    // Getters e Setters para todos os campos...
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }

    public String getTelefone() { return telefone; } // <<< GETTER
    public void setTelefone(String telefone) { this.telefone = telefone; } // <<< SETTER

    public String getImagemPerfilBase64() { return imagemPerfilBase64; }
    public void setImagemPerfilBase64(String imagemPerfilBase64) { this.imagemPerfilBase64 = imagemPerfilBase64; }

    public String getImagemBackgroundBase64() { return imagemBackgroundBase64; }
    public void setImagemBackgroundBase64(String imagemBackgroundBase64) { this.imagemBackgroundBase64 = imagemBackgroundBase64; }
}