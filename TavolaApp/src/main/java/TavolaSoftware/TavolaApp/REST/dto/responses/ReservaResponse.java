package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.Reserva;
import TavolaSoftware.TavolaApp.REST.model.Usuario; // <<< NOVO IMPORT
import TavolaSoftware.TavolaApp.tools.StatusReserva;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class ReservaResponse {
    private UUID id;
    private LocalDate data;
    private LocalTime hora;
    private int pessoas;
    private String observacoes;
    private StatusReserva status;
    
    // Dados do Restaurante
    private UUID idRestaurante;
    private String restaurante;

    // Dados do Cliente (Enriquecidos)
    private UUID idCliente;
    private String cliente; // Nome do cliente
    private String emailCliente; // <<< NOVO CAMPO
    private String telefoneCliente; // <<< NOVO CAMPO
    private String imagemPerfilCliente; // <<< NOVO CAMPO
    
    // Dados das Mesas
    private List<SimpleMesaResponse> mesas; // <<< MUDANÇA 1: O tipo da lista foi alterado
    
    public ReservaResponse() {}

    public ReservaResponse(Reserva reserva) {
        this.id = reserva.getId();
        this.data = reserva.getDataReserva();
        this.hora = reserva.getHoraReserva();
        this.pessoas = reserva.getQuantidadePessoas();
        this.observacoes = reserva.getObservacoes();
        this.status = reserva.getStatus();

        if (reserva.getRestaurante() != null && reserva.getRestaurante().getUsuario() != null) {
            this.idRestaurante = reserva.getRestaurante().getId();
            this.restaurante = reserva.getRestaurante().getUsuario().getNome();
        }

        // Mapeando dados do Cliente
        if (reserva.getCliente() != null) {
            Usuario usuarioCliente = reserva.getCliente().getUsuario();
            this.idCliente = reserva.getCliente().getId();
            this.cliente = usuarioCliente.getNome();
            this.emailCliente = usuarioCliente.getEmail();
            this.telefoneCliente = usuarioCliente.getTelefone();
            this.imagemPerfilCliente = usuarioCliente.getImagem();
        }

        if (reserva.getMesas() != null) {
            // <<< MUDANÇA 2: Mapeando a lista de Mesas para a lista do novo DTO
            this.mesas = reserva.getMesas().stream()
                                  .map(SimpleMesaResponse::new)
                                  .collect(Collectors.toList());
        }
    }

    // Adicione os Getters e Setters para os novos campos
    public String getEmailCliente() { return emailCliente; }
    public void setEmailCliente(String emailCliente) { this.emailCliente = emailCliente; }
    public String getTelefoneCliente() { return telefoneCliente; }
    public void setTelefoneCliente(String telefoneCliente) { this.telefoneCliente = telefoneCliente; }
    public String getImagemPerfilCliente() { return imagemPerfilCliente; }
    public void setImagemPerfilCliente(String imagemPerfilCliente) { this.imagemPerfilCliente = imagemPerfilCliente; }
    
    // ... (Getters e Setters existentes permanecem aqui) ...
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public LocalTime getHora() { return hora; }
    public void setHora(LocalTime hora) { this.hora = hora; }
    public int getPessoas() { return pessoas; }
    public void setPessoas(int pessoas) { this.pessoas = pessoas; }
    
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public StatusReserva getStatus() { return status; }
    public void setStatus(StatusReserva status) { this.status = status; }
    public UUID getIdRestaurante() { return idRestaurante; }
    public void setIdRestaurante(UUID idRestaurante) { this.idRestaurante = idRestaurante; }
    public String getRestaurante() { return restaurante; }
    public void setRestaurante(String restaurante) { this.restaurante = restaurante; }
    public UUID getIdCliente() { return idCliente; }
    public void setIdCliente(UUID idCliente) { this.idCliente = idCliente; }
    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }
    // <<< MUDANÇA 3: Getter e Setter atualizados para o novo tipo da lista
    public List<SimpleMesaResponse> getMesas() { return mesas; }
    public void setMesas(List<SimpleMesaResponse> mesas) { this.mesas = mesas; }
}