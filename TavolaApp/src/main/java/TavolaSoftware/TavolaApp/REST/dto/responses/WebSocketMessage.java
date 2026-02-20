package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.tools.EventLabel;

public class WebSocketMessage {

    private EventLabel tipoEvento;
    private Object payload; // Usamos 'Object' para ser genérico e carregar qualquer tipo de dado

    public WebSocketMessage(EventLabel tipoEvento, Object payload) {
        this.tipoEvento = tipoEvento;
        this.payload = payload;
    }

    // Getters
    public EventLabel getTipoEvento() {
        return tipoEvento;
    }

    public Object getPayload() {
        return payload;
    }
}