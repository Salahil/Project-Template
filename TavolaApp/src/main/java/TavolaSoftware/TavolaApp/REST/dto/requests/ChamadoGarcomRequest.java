// Crie em /dto/requests/ChamadoGarcomRequest.java
package TavolaSoftware.TavolaApp.REST.dto.requests;

import java.util.UUID;

public class ChamadoGarcomRequest {

    private UUID mesaId;

    // Getters e Setters
    public UUID getMesaId() {
        return mesaId;
    }

    public void setMesaId(UUID mesaId) {
        this.mesaId = mesaId;
    }
}