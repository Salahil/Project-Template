package TavolaSoftware.TavolaApp.REST.dto.requests;

import java.util.UUID; // <<< ADICIONAR IMPORT

//Classe DTO para receber os dados da avaliação
public class AvaliacaoRequest {
    private double score;
    private String comentario;
    private UUID reservaId; 

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
    
    // <<< NOVOS GETTERS/SETTERS >>>
    public UUID getReservaId() {
        return reservaId;
    }

    public void setReservaId(UUID reservaId) {
        this.reservaId = reservaId;
    }
}