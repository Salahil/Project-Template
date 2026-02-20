package TavolaSoftware.TavolaApp.REST.dto.responses;

import java.util.List;

// Este DTO representa a resposta completa para a tela de cardápio público
public class PublicCardapioResponse {

    private String nomeRestaurante;
    private String imagemRestaurante;
    private List<CardapioResponse> cardapio; // A lista de itens do cardápio

    public PublicCardapioResponse(String nomeRestaurante, String imagemRestaurante, List<CardapioResponse> cardapio) {
        this.nomeRestaurante = nomeRestaurante;
        this.imagemRestaurante = imagemRestaurante;
        this.cardapio = cardapio;
    }

    // Getters
    public String getNomeRestaurante() {
        return nomeRestaurante;
    }

    public String getImagemRestaurante() {
        return imagemRestaurante;
    }

    public List<CardapioResponse> getCardapio() {
        return cardapio;
    }
}