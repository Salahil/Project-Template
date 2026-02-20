package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.Ambiente;
import java.util.List;
import java.util.UUID;

// DTO de nível superior para o dashboard
public class AmbienteDashboardResponse {
    
    private UUID id;
    private String nome;
    private List<MesaDashboardResponse> mesas;

    public AmbienteDashboardResponse(Ambiente ambiente, List<MesaDashboardResponse> mesas) {
        this.id = ambiente.getId();
        this.nome = ambiente.getNome();
        this.mesas = mesas;
    }

    // Getters e Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public List<MesaDashboardResponse> getMesas() { return mesas; }
    public void setMesas(List<MesaDashboardResponse> mesas) { this.mesas = mesas; }
}