package TavolaSoftware.TavolaApp.REST.dto.responses;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import TavolaSoftware.TavolaApp.REST.model.Mesa;
import TavolaSoftware.TavolaApp.REST.model.Reserva;
import TavolaSoftware.TavolaApp.REST.model.Usuario;

public class ListaEsperaResponse {
    private UUID id;
    private UUID clienteId;
    private String clienteNome;
    private List<UUID> mesaIds;
    private String data; // Formato ISO
    private String horario;
    private String periodo;
    private int pessoas;
    private String status;
    private String preferencias;
    private String imagemperfil;

    public ListaEsperaResponse(Reserva reserva) {
        this.id = reserva.getId();
        this.pessoas = reserva.getQuantidadePessoas();
        this.preferencias = reserva.getObservacoes();
        
        if (reserva.getCliente() != null) {
            this.clienteId = reserva.getCliente().getId();
            Usuario usuarioCliente = reserva.getCliente().getUsuario();
            if (usuarioCliente != null) {
                this.clienteNome = usuarioCliente.getNome();
                this.imagemperfil = usuarioCliente.getImagem();
            }
        }

        if (reserva.getMesas() != null) {
            this.mesaIds = reserva.getMesas().stream().map(Mesa::getId).collect(Collectors.toList());
        }

        if (reserva.getDataReserva() != null) {
            this.data = reserva.getDataReserva().atStartOfDay().toString();
        }
        
        if (reserva.getHoraReserva() != null) {
            this.horario = reserva.getHoraReserva().format(DateTimeFormatter.ofPattern("HH:mm"));
            int hora = reserva.getHoraReserva().getHour();
            if (hora >= 11 && hora < 15) {
                this.periodo = "Almoço";
            } else if (hora >= 18 && hora < 24) {
                this.periodo = "Jantar";
            } else {
                this.periodo = "Outro";
            }
        }
        
        if (reserva.getStatus() != null) {
            this.status = reserva.getStatus().name().toLowerCase();
        }
    }

    // --- GETTERS E SETTERS ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getClienteId() { return clienteId; }
    public void setClienteId(UUID clienteId) { this.clienteId = clienteId; }
    public String getClienteNome() { return clienteNome; }
    public void setClienteNome(String clienteNome) { this.clienteNome = clienteNome; }
    public List<UUID> getMesaIds() { return mesaIds; }
    public void setMesaIds(List<UUID> mesaIds) { this.mesaIds = mesaIds; }
    public String getData() { return data; }
    public void setData(String data) { this.data = data; }
    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }
    public String getPeriodo() { return periodo; }
    public void setPeriodo(String periodo) { this.periodo = periodo; }
    public int getPessoas() { return pessoas; }
    public void setPessoas(int pessoas) { this.pessoas = pessoas; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPreferencias() { return preferencias; }
    public void setPreferencias(String preferencias) { this.preferencias = preferencias; }
    public String getImagemperfil() { return imagemperfil; }
    public void setImagemperfil(String imagemperfil) { this.imagemperfil = imagemperfil; }
}