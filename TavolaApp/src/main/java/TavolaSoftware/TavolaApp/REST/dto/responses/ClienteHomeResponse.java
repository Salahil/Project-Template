package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.model.Usuario;
import TavolaSoftware.TavolaApp.tools.Endereco;

public class ClienteHomeResponse {

    private String id;
    private String nome;
    private String tipoCozinha;
    private double mediaAvaliacao;
    private String imagemPrincipal; // O tipo List<String> está correto
    private int totalAvaliacao; // Agora este campo será preenchido
    private Endereco endereco;

    // Construtor padrão
    public ClienteHomeResponse() {
    }

    // Construtor que aceita a entidade Restaurante
    public ClienteHomeResponse(Restaurante restaurante) {
        this.id = restaurante.getId() != null ? restaurante.getId().toString() : null;

        Usuario usuario = restaurante.getUsuario();
        if (usuario != null) {
            this.nome = usuario.getNome();
            this.endereco = usuario.getEndereco();
        }

        this.tipoCozinha = restaurante.getTipoCozinha();
        this.mediaAvaliacao = restaurante.getMediaAvaliacao();

        // <<< CORREÇÃO 1: Preenchendo o total de avaliações >>>
        // Pegamos o total de avaliações do objeto Restaurante.
        this.totalAvaliacao = restaurante.getTotalDeAvaliacoes();

        // <<< CORREÇÃO 2: Lógica para a lista de imagens >>>
        // Inicializamos a lista de imagens.
        this.imagemPrincipal = restaurante.getImagemPrincipal();
    }

    // Getters e Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTipoCozinha() {
        return tipoCozinha;
    }

    public void setTipoCozinha(String tipoCozinha) {
        this.tipoCozinha = tipoCozinha;
    }

    public double getMediaAvaliacao() {
        return mediaAvaliacao;
    }

    public void setMediaAvaliacao(double mediaAvaliacao) {
        this.mediaAvaliacao = mediaAvaliacao;
    }

    // <<< CORREÇÃO 4: Getters e setters corretos para a lista de imagens >>>
    public String getImagemPrincipal() {
        return imagemPrincipal;
    }

    public void setImagemPrincipal(String string) {
        this.imagemPrincipal = string;
    }

    public int getTotalAvaliacao() {
        return totalAvaliacao;
    }

    public void setTotalAvaliacao(int totalAvaliacao) {
        this.totalAvaliacao = totalAvaliacao;
    }

    public Endereco getEndereco() {
        return endereco;
    }

    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
    }
}