package TavolaSoftware.TavolaApp.REST.dto.requests;

public class SenhaResetVerificacaoRequest {
    private String email;
    private String codigo;
    private String novaSenha;

    // Getters e Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNovaSenha() { return novaSenha; }
    public void setNovaSenha(String novaSenha) { this.novaSenha = novaSenha; }
}