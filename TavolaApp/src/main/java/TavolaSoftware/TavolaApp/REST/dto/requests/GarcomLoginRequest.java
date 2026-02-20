// Crie este novo arquivo em REST/dto/requests/GarcomLoginRequest.java
package TavolaSoftware.TavolaApp.REST.dto.requests;

public class GarcomLoginRequest {
    private String emailRestaurante;
    private String codigoIdentidade;
    private String senha;

    // Getters e Setters
    public String getEmailRestaurante() { return emailRestaurante; }
    public void setEmailRestaurante(String emailRestaurante) { this.emailRestaurante = emailRestaurante; }
    public String getCodigoIdentidade() { return codigoIdentidade; }
    public void setCodigoIdentidade(String codigoIdentidade) { this.codigoIdentidade = codigoIdentidade; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}