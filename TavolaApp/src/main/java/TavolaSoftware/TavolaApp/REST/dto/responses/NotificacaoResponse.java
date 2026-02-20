// Crie em /dto/responses/NotificacaoResponse.java
package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.Notificacao;
import java.time.LocalDate;
import java.util.UUID;

public class NotificacaoResponse {
    private UUID id;
    private String nomeRestaurante;
    private LocalDate dataReserva;
    private UUID restauranteId;

    public NotificacaoResponse(Notificacao notificacao) {
        this.id = notificacao.getId();
        this.nomeRestaurante = notificacao.getNomeRestaurante();
        this.dataReserva = notificacao.getDataReserva();
        this.restauranteId = notificacao.getRestauranteId();
    }

    // Getters
    public UUID getId() { return id; }
    public String getNomeRestaurante() { return nomeRestaurante; }
    public LocalDate getDataReserva() { return dataReserva; }
    public UUID getRestauranteId() { return restauranteId; }
}