package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.Reserva;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

// DTO leve para representar uma reserva dentro do dashboard
public class ReservaSimplesResponse {
    private UUID id;
    private UUID clienteId;
    private LocalDate dataReserva;
    private LocalTime horaReserva;
    private int quantidadePessoas;
    private String status;

    public ReservaSimplesResponse(Reserva reserva) {
        this.id = reserva.getId();
        this.clienteId = reserva.getCliente().getId();
        this.dataReserva = reserva.getDataReserva();
        this.horaReserva = reserva.getHoraReserva();
        this.quantidadePessoas = reserva.getQuantidadePessoas();
        this.status = reserva.getStatus().toString();
    }

    // Getters e Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getClienteId() { return clienteId; }
    public void setClienteId(UUID clienteId) { this.clienteId = clienteId; }
    public LocalDate getDataReserva() { return dataReserva; }
    public void setDataReserva(LocalDate dataReserva) { this.dataReserva = dataReserva; }
    public LocalTime getHoraReserva() { return horaReserva; }
    public void setHoraReserva(LocalTime horaReserva) { this.horaReserva = horaReserva; }
    public int getQuantidadePessoas() { return quantidadePessoas; }
    public void setQuantidadePessoas(int quantidadePessoas) { this.quantidadePessoas = quantidadePessoas; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}