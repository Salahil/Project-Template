package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.AtendimentoMesa;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class AtendimentoSimplesResponse {
    private UUID id;
    private UUID mesaId;
    private boolean ativo;
    private LocalDateTime horaInicio;
    private String nomeCliente;
    private List<GarcomResponse> garcons;

    public AtendimentoSimplesResponse(AtendimentoMesa atendimento) {
        this.id = atendimento.getId();
        this.mesaId = atendimento.getMesa().getId();
        this.ativo = atendimento.isAtivo();
        this.horaInicio = atendimento.getHoraInicio();
        this.nomeCliente = atendimento.getNomeCliente();
        
        // Converte a lista de Entidades Garcom em uma lista de DTOs GarcomResponse
        this.garcons = atendimento.getGarcons().stream()
                .map(GarcomResponse::new) // Chama o construtor de GarcomResponse
                .collect(Collectors.toList());
    }
    
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getMesaId() { return mesaId; }
    public void setMesaId(UUID mesaId) { this.mesaId = mesaId; }

    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }

    public LocalDateTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalDateTime horaInicio) { this.horaInicio = horaInicio; }

    public String getNomeCliente() { return nomeCliente; }
    public void setNomeCliente(String nomeCliente) { this.nomeCliente = nomeCliente; }

    public List<GarcomResponse> getGarcons() {
        return garcons;
    }

    // Setter atualizado
    public void setGarcons(List<GarcomResponse> garcons) {
        this.garcons = garcons;
    }
}