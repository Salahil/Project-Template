package TavolaSoftware.TavolaApp.REST.dto.requests;

import java.util.List;
import java.util.UUID;

// Não é estritamente necessário usar as anotações do Jackson aqui
// se os nomes dos campos no JSON corresponderem exatamente aos nomes dos campos na classe.
// Mas podem ser úteis para mapeamentos mais complexos ou diferentes nomes.
// import com.fasterxml.jackson.annotation.JsonProperty; 

public class ReservaRequest {

    private UUID idRestaurante;
    private String dataReserva; // Formato "YYYY-MM-DD"
    private String horarioReserva; // Formato "HH:MM"
    private List<UUID> idsMesas;
    private int quantidadePessoasReserva;
    private String comentariosPreferenciaReserva; // Opcional

    // Construtor vazio é necessário para o Jackson (biblioteca de JSON)
    public ReservaRequest() {
    }

    // Getters e Setters
    public List<UUID> getIdsMesas() {
        return idsMesas;
    }

    public void setIdsMesas(List<UUID> idsMesas) {
        this.idsMesas = idsMesas;
    }
    
    public UUID getIdRestaurante() {
        return idRestaurante;
    }

    public void setIdRestaurante(UUID idRestaurante) {
        this.idRestaurante = idRestaurante;
    }

    public String getDataReserva() {
        return dataReserva;
    }

    public void setDataReserva(String dataReserva) {
        this.dataReserva = dataReserva;
    }

    public String getHorarioReserva() {
        return horarioReserva;
    }

    public void setHorarioReserva(String horarioReserva) {
        this.horarioReserva = horarioReserva;
    }

    public int getQuantidadePessoasReserva() {
        return quantidadePessoasReserva;
    }

    public void setQuantidadePessoasReserva(int quantidadePessoasReserva) {
        this.quantidadePessoasReserva = quantidadePessoasReserva;
    }

    public String getComentariosPreferenciaReserva() {
        return comentariosPreferenciaReserva;
    }

    public void setComentariosPreferenciaReserva(String comentariosPreferenciaReserva) {
        this.comentariosPreferenciaReserva = comentariosPreferenciaReserva;
    }
}