package TavolaSoftware.TavolaApp.REST.dto.requests;

public class SenhaResetConfirmRequest {
    private String token; // O token recebido na URL
    private String novaSenha;

    // Getters e Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getNovaSenha() { return novaSenha; }
    public void setNovaSenha(String novaSenha) { this.novaSenha = novaSenha; }
}