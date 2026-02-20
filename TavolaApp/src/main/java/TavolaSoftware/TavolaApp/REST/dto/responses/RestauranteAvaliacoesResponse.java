package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import java.util.List;

public class RestauranteAvaliacoesResponse {
    private double mediaAvaliacao;
    private int totalAvaliacoes;
    private List<AvaliacaoResponse> avaliacoes;

    public RestauranteAvaliacoesResponse(Restaurante restaurante, List<AvaliacaoResponse> avaliacoes) {
        this.mediaAvaliacao = restaurante.getMediaAvaliacao();
        this.totalAvaliacoes = restaurante.getTotalDeAvaliacoes();
        this.avaliacoes = avaliacoes;
    }

    // Getters
    public double getMediaAvaliacao() { return mediaAvaliacao; }
    public int getTotalAvaliacoes() { return totalAvaliacoes; }
    public List<AvaliacaoResponse> getAvaliacoes() { return avaliacoes; }
}