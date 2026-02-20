package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.Mesa;
import java.util.UUID;

/**
 * DTO simplificado para representar os dados de uma Mesa
 * dentro de outros DTOs, como o ReservaResponse.
 */
public class SimpleMesaResponse {

    private UUID id;
    private String nome;
    private int capacidade;

    // Construtor que converte a entidade Mesa para este DTO.
    public SimpleMesaResponse(Mesa mesa) {
        this.id = mesa.getId();
        this.nome = mesa.getNome();
        this.capacidade = mesa.getCapacidade();
    }

    // Getters e Setters
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

    public int getCapacidade() {
        return capacidade;
    }

    public void setCapacidade(int capacidade) {
        this.capacidade = capacidade;
    }
}