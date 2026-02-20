package TavolaSoftware.TavolaApp.REST.dto.requests;

public class LoginRequest {
    private String email;
    private String senha;
    private boolean mantenhaMeConectado = false; // <<< NOVO CAMPO

    // Getters e Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    
    public boolean isMantenhaMeConectado() { return mantenhaMeConectado; }
    public void setMantenhaMeConectado(boolean mantenhaMeConectado) { this.mantenhaMeConectado = mantenhaMeConectado; }
}
