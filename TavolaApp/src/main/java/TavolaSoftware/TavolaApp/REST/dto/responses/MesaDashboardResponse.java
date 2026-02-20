package TavolaSoftware.TavolaApp.REST.dto.responses;

import java.util.List;

// DTO para agrupar uma Mesa e suas listas de atendimentos e reservas
public class MesaDashboardResponse {
    
    // Dados da Mesa (já inclui o status)
    private MesaResponse mesa;
    
    // Lista de TODOS os atendimentos (ativos e inativos)
    private List<AtendimentoSimplesResponse> atendimentos;
    
    // Lista de reservas CONFIRMADAS/ATIVAS
    private List<ReservaSimplesResponse> reservas;

    // Construtor
    public MesaDashboardResponse(MesaResponse mesa, List<AtendimentoSimplesResponse> atendimentos, List<ReservaSimplesResponse> reservas) {
        this.mesa = mesa;
        this.atendimentos = atendimentos;
        this.reservas = reservas;
    }

    // Getters e Setters
    public MesaResponse getMesa() { return mesa; }
    public void setMesa(MesaResponse mesa) { this.mesa = mesa; }
    public List<AtendimentoSimplesResponse> getAtendimentos() { return atendimentos; }
    public void setAtendimentos(List<AtendimentoSimplesResponse> atendimentos) { this.atendimentos = atendimentos; }
    public List<ReservaSimplesResponse> getReservas() { return reservas; }
    public void setReservas(List<ReservaSimplesResponse> reservas) { this.reservas = reservas; }
}