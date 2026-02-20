package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.Mesa;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class MesaComReservasResponse {
    private UUID id;
    private String nome;
    private int capacidade;
    private String status; // Status da MESA (Livre, Ocupada, Reservada)
    private List<ReservaSimplesResponse> reservasDoDia;

    public MesaComReservasResponse(Mesa mesa, List<ReservaResponse> reservas) {
        this.id = mesa.getId();
        this.nome = mesa.getNumero();
        this.capacidade = mesa.getCapacidade();
        this.status = mesa.getStatus() != null ? mesa.getStatus().name() : "INDEFINIDO"; // Usar o status da entidade Mesa

        // Mapeia apenas as informações relevantes da reserva para este DTO
        this.reservasDoDia = reservas.stream()
            .filter(reserva -> reserva.getMesas().stream().anyMatch(m -> m.getId().equals(mesa.getId()))) // Garante que a reserva é desta mesa
            .map(ReservaSimplesResponse::new)
            .collect(Collectors.toList());
    }

    // Getters
    public UUID getId() { return id; }
    public String getNome() { return nome; }
    public int getCapacidade() { return capacidade; }
    public String getStatus() { return status; }
    public List<ReservaSimplesResponse> getReservasDoDia() { return reservasDoDia; }

    // DTO Interno para Reservas Simplificadas
    public static class ReservaSimplesResponse {
        private UUID idReserva;
        private String hora;
        private int pessoas;
        private String nomeCliente;
        private String statusReserva;

        public ReservaSimplesResponse(ReservaResponse reservaCompleta) {
            this.idReserva = reservaCompleta.getId();
            this.hora = reservaCompleta.getHora() != null ? reservaCompleta.getHora().toString() : null;
            this.pessoas = reservaCompleta.getPessoas();
            this.nomeCliente = reservaCompleta.getCliente();
            this.statusReserva = reservaCompleta.getStatus() != null ? reservaCompleta.getStatus().name() : null;
        }

        // Getters
        public UUID getIdReserva() { return idReserva; }
        public String getHora() { return hora; }
        public int getPessoas() { return pessoas; }
        public String getNomeCliente() { return nomeCliente; }
        public String getStatusReserva() { return statusReserva; }
    }
}