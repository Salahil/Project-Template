package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.Garcom;
import java.util.UUID;

public class GarcomResponse {
    private UUID id;
    private String nome;
    private String codigoIdentidade;
    private String imagem;

    // Construtor
    public GarcomResponse(Garcom garcom) {
        this.id = garcom.getId();
        this.nome = garcom.getNome();
        this.codigoIdentidade = garcom.getCodigoIdentidade();
        this.imagem = garcom.getImagem();
    }

    // --- GETTERS ---
    public UUID getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getCodigoIdentidade() {
        return codigoIdentidade;
    }
    
    public String getImagem() {
        return imagem;
    }
}