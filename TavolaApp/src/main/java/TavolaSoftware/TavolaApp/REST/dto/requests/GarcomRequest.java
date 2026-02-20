package TavolaSoftware.TavolaApp.REST.dto.requests;

public class GarcomRequest {
    private String nome;
    private String senha;
    private String imagem; // (Base64 ou nome de arquivo existente)

    // Getters e Setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    
    // --- MÉTODOS CORRIGIDOS ---
    public String getImagem() { return imagem; } 
    public void setImagem(String imagem) { this.imagem = imagem; }
    // --- FIM DA CORREÇÃO ---
}