package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.Ambiente;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * DTO para enviar os dados de um Ambiente.
 * Agora inclui a lista completa de detalhes de cada Mesa.
 */
public class AmbienteResponse {

    private UUID id;
    private String nome;
    private List<MesaResponse> mesas;

    /**
     * Construtor que converte a entidade Ambiente para este DTO de resposta.
     * @param ambiente A entidade JPA a ser convertida.
     */
    public AmbienteResponse(Ambiente ambiente) {
        this.id = ambiente.getId();
        this.nome = ambiente.getNome();
        if (ambiente.getMesas() != null) {
            // <<< ALTERAÇÃO 2: Mapeando para MesaResponse usando o método fromEntity.
            this.mesas = ambiente.getMesas().stream()
                               .map(MesaResponse::fromEntity)
                               .collect(Collectors.toList());
        }
    }

    // Getters e Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    // <<< ALTERAÇÃO 3: Getter e Setter atualizados para o novo tipo da lista.
    public List<MesaResponse> getMesas() { return mesas; }
    public void setMesas(List<MesaResponse> mesas) { this.mesas = mesas; }

    // <<< ALTERAÇÃO 4: A classe interna MesaSimpleResponse foi REMOVIDA.
    // Não precisamos mais dela aqui.
}