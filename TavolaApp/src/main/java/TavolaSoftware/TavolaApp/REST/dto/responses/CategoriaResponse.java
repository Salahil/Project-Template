package TavolaSoftware.TavolaApp.REST.dto.responses;

import java.util.UUID;

public class CategoriaResponse {
    private UUID id;
    private String nome;

    public CategoriaResponse() {}

    public CategoriaResponse(UUID id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
