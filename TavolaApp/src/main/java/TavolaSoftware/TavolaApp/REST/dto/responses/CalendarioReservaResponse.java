package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.Reserva;

public class CalendarioReservaResponse {
    private String data;
    private String clienteNome;
    private int pessoas;
    private String status;

    public CalendarioReservaResponse(Reserva reserva) {
        if (reserva.getDataReserva() != null) {
            this.data = reserva.getDataReserva().atStartOfDay().toString(); // Formato ISO
        }
        if (reserva.getCliente() != null && reserva.getCliente().getUsuario() != null) {
            this.clienteNome = reserva.getCliente().getUsuario().getNome();
        }
        this.pessoas = reserva.getQuantidadePessoas();
        if (reserva.getStatus() != null) {
            this.status = reserva.getStatus().name().toLowerCase();
        }
    }

    // --- GETTERS E SETTERS ---
    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getClienteNome() {
        return clienteNome;
    }

    public void setClienteNome(String clienteNome) {
        this.clienteNome = clienteNome;
    }

    public int getPessoas() {
        return pessoas;
    }

    public void setPessoas(int pessoas) {
        this.pessoas = pessoas;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}