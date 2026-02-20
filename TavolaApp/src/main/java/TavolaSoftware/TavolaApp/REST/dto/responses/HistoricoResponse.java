package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.Reserva;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.tools.HorarioFuncionamento;
import TavolaSoftware.TavolaApp.tools.StatusReserva;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

public class HistoricoResponse {

    // --- Campos para a visão do CLIENTE ---
    private UUID idReserva;
    private String data;
    private String horario;
    private int quantidadePessoas;
    private StatusReserva status;
    private String comentariosPreferenciaReserva;
    private UUID idRestaurante;
    private String nomeRestaurante;
    private String imagemRestaurante;
    private String enderecoResumido;
    private List<HorarioFuncionamento> horariosFuncionamento;

    // Construtor único, focado na visão do CLIENTE
    public HistoricoResponse(Reserva reserva) {
        Restaurante restaurante = reserva.getRestaurante();
        this.idReserva = reserva.getId();
        this.data = reserva.getDataReserva().format(DateTimeFormatter.ISO_LOCAL_DATE);
        this.horario = reserva.getHoraReserva().format(DateTimeFormatter.ofPattern("HH:mm"));
        this.quantidadePessoas = reserva.getQuantidadePessoas();
        this.status = reserva.getStatus();
        this.comentariosPreferenciaReserva = reserva.getObservacoes();

        this.idRestaurante = restaurante.getId();
        this.nomeRestaurante = restaurante.getNome();
        this.enderecoResumido = restaurante.getEndereco() != null ? 
                                restaurante.getEndereco().getBairro() + ", " + restaurante.getEndereco().getCidade() : 
                                "Endereço não informado";
        
        this.imagemRestaurante = restaurante.getImagemPrincipal();
        
        this.horariosFuncionamento = restaurante.getHorariosFuncionamento();
    }

    // Getters para todos os campos
    public UUID getIdReserva() { return idReserva; }
    public String getData() { return data; }
    public String getHorario() { return horario; }
    public int getQuantidadePessoas() { return quantidadePessoas; }
    public StatusReserva getStatus() { return status; }
    public String getComentariosPreferenciaReserva() { return comentariosPreferenciaReserva; }
    public UUID getIdRestaurante() { return idRestaurante; }
    public String getNomeRestaurante() { return nomeRestaurante; }
    public String getImagemRestaurante() { return imagemRestaurante; }
    public String getEnderecoResumido() { return enderecoResumido; }
    public List<HorarioFuncionamento> getHorariosFuncionamento() { return horariosFuncionamento; }
}