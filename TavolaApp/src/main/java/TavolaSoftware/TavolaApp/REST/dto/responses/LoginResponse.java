package TavolaSoftware.TavolaApp.REST.dto.responses;

import java.util.UUID;

public class LoginResponse {
    private String token;
    private String nome;
    private String tipoUsuario;
    private UUID id;
    private String email;
    private String imagem;
    private String imagemPrincipal;
    
    // <<< CAMPO ADICIONADO >>>
    private UUID restauranteId; // O ID do restaurante (se o usuário for Garçom ou Restaurante)

    // <<< CONSTRUTOR ATUALIZADO >>>
    public LoginResponse(String token, String nome, String tipoUsuario, UUID id, String email, String imagem, String imagemBackground, UUID restauranteId) {
        this.token = token;
        this.nome = nome;
        this.tipoUsuario = tipoUsuario;
        this.id = id;
        this.email = email;
        this.imagem = imagem;
        this.imagemPrincipal = imagemBackground;
        this.restauranteId = restauranteId; // <<< ATRIBUIÇÃO DO NOVO CAMPO
    }

    public String getToken() { return token; }
    public String getNome() { return nome; } 
    public String getTipoUsuario() { return tipoUsuario; }
    public UUID getId() { return id; }
    public String getEmail() { return email; }
    public String getImagem() { return imagem; }
    public String getImagemPrincipal() { return imagemPrincipal; }
    
    // <<< GETTER PARA O NOVO CAMPO >>>
    public UUID getRestauranteId() { return restauranteId; }
}