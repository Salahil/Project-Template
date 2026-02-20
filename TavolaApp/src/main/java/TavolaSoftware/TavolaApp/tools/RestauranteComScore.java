package TavolaSoftware.TavolaApp.tools; // Mesmo pacote do RestauranteService

import TavolaSoftware.TavolaApp.REST.model.Restaurante;

// Pode ser public ou package-private (sem modificador de acesso explícito)
// Se for usada apenas pelo RestauranteService no mesmo pacote, package-private é suficiente.
// Public é mais garantido contra problemas de visibilidade com classloaders.
public class RestauranteComScore {
    private Restaurante restaurante;
    private double finalScore;

    public RestauranteComScore(Restaurante restaurante, double finalScore) {
        this.restaurante = restaurante;
        this.finalScore = finalScore;
    }

    public Restaurante getRestaurante() {
        return restaurante;
    }

    public double getFinalScore() {
        return finalScore;
    }

    // Opcional: adicionar setters se precisar modificar depois de criar
    public void setRestaurante(Restaurante restaurante) {
        this.restaurante = restaurante;
    }

    public void setFinalScore(double finalScore) {
        this.finalScore = finalScore;
    }
}