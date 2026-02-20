package TavolaSoftware.TavolaApp.REST.dto.requests;

public class LoginVerificacaoRequest {
    private String email;
    private String codigo;
    private boolean mantenhaMeConectado;

    // Getters e Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public boolean isMantenhaMeConectado() { return mantenhaMeConectado; }
    public void setMantenhaMeConectado(boolean mantenhaMeConectado) { this.mantenhaMeConectado = mantenhaMeConectado; }
}