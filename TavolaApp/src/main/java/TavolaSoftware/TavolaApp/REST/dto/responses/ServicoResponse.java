package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.Servico;
import java.util.UUID;

public class ServicoResponse {

    private UUID id;
    private String nome;
    private String descricao;

    public ServicoResponse(Servico servico) {
        this.id = servico.getId();
        this.nome = servico.getNome();
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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}