package TavolaSoftware.TavolaApp.REST.dto.responses;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import TavolaSoftware.TavolaApp.REST.model.Garcom;
import TavolaSoftware.TavolaApp.REST.model.RegistroAtendimento;

public class RegistroAtendimentoResponse {

    private UUID id;
    private LocalDateTime horaInicio;
    private LocalDateTime horaFim;
    private Double valorTotal; 

    private String nomeMesa;
    private UUID mesaId;

    private String nomeCliente; // Opcional

    private List<String> nomesGarcons; // Lista de nomes
    private int totalPedidos; // Quantidade de pedidos

    public RegistroAtendimentoResponse(RegistroAtendimento registro) {
        this.id = registro.getId();
        this.horaInicio = registro.getHoraInicio();
        this.horaFim = registro.getHoraFim();
        this.valorTotal = registro.getValorTotal();

        if (registro.getMesa() != null) {
            this.nomeMesa = registro.getMesa().getNome();
            this.mesaId = registro.getMesa().getId();
        }

        // <<< LÓGICA DO NOME DO CLIENTE ATUALIZADA >>>
        if (registro.getCliente() != null && registro.getCliente().getUsuario() != null) {
            this.nomeCliente = registro.getCliente().getUsuario().getNome();
        // ANTES: } else if (registro.getNomeClienteOcasional() != null && !registro.getNomeClienteOcasional().isBlank()) {
        } else if (registro.getNomeCliente() != null && !registro.getNomeCliente().isBlank()) { // DEPOIS
            // ANTES: this.nomeCliente = registro.getNomeClienteOcasional();
            this.nomeCliente = registro.getNomeCliente(); // DEPOIS
        } else {
            this.nomeCliente = "Não identificado";
        }
        // <<< FIM DA LÓGICA DO NOME >>>

        if (registro.getGarcons() != null) {
             this.nomesGarcons = registro.getGarcons().stream()
                .map(Garcom::getNome)
                .distinct()
                .collect(Collectors.toList());
        }

        if (registro.getPedidos() != null) {
            this.totalPedidos = registro.getPedidos().size();
        }
    }

    // --- GETTERS E SETTERS (Sem alterações, já estavam corretos) ---

    public UUID getId() {return id;}
    public void setId(UUID id) {this.id = id;}
    public LocalDateTime getHoraInicio() {return horaInicio;}
    public void setHoraInicio(LocalDateTime horaInicio) {this.horaInicio = horaInicio;}
    public LocalDateTime getHoraFim() {return horaFim;}
    public void setHoraFim(LocalDateTime horaFim) {this.horaFim = horaFim;}
    public Double getValorTotal() {return valorTotal;}
    public void setValorTotal(Double valorTotal) {this.valorTotal = valorTotal;}
    public String getNomeMesa() {return nomeMesa;}
    public void setNomeMesa(String nomeMesa) {this.nomeMesa = nomeMesa;}
    public UUID getMesaId() {return mesaId;}
    public void setMesaId(UUID mesaId) {this.mesaId = mesaId;}
    public String getNomeCliente() {return nomeCliente;}
    public void setNomeCliente(String nomeCliente) {this.nomeCliente = nomeCliente;}
    public List<String> getNomesGarcons() {return nomesGarcons;}
    public void setNomesGarcons(List<String> nomesGarcons) {this.nomesGarcons = nomesGarcons;}
    public int getTotalPedidos() {return totalPedidos;}
    public void setTotalPedidos(int totalPedidos) {this.totalPedidos = totalPedidos;}
}