package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.Avaliacao;
import java.util.UUID;
import java.time.LocalDate; // <<< ADICIONAR IMPORT
import java.time.format.DateTimeFormatter; // <<< ADICIONAR IMPORT
import java.util.Locale; // <<< ADICIONAR IMPORT

public class AvaliacaoResponse {
    private String imagemCliente;
    private String nomeCliente;
    private int nota;
    private UUID idCliente;
    private String comentario;
    
    private String dataReserva;
    private String dataReservaPorExtenso;

    public AvaliacaoResponse(Avaliacao avaliacao) {
        this.nota = avaliacao.getScore();
        this.comentario = avaliacao.getComentario();
        
        if (avaliacao.getCliente() != null && avaliacao.getCliente().getUsuario() != null) {
            this.idCliente = avaliacao.getCliente().getId();
            this.nomeCliente = avaliacao.getCliente().getUsuario().getNome();
            this.imagemCliente = avaliacao.getCliente().getUsuario().getImagem();
        } else {
            this.idCliente = null;
            this.nomeCliente = "Usuário Anônimo";
            this.imagemCliente = null;
        }
        
        // <<< NOVA LÓGICA DE DATA >>>
        // Verifica se a avaliação está ligada a uma reserva
        if (avaliacao.getReserva() != null && avaliacao.getReserva().getDataReserva() != null) {
            LocalDate data = avaliacao.getReserva().getDataReserva(); 
            
            // 1. Formato DD/MM/AAAA
            DateTimeFormatter dtfSimples = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            this.dataReserva = data.format(dtfSimples);

            // 2. Formato por extenso (em Português)
            Locale brasil = new Locale("pt", "BR");
            DateTimeFormatter dtfExtenso = DateTimeFormatter.ofPattern("d 'de' MMMM 'de' yyyy", brasil);
            this.dataReservaPorExtenso = data.format(dtfExtenso);
            
        } else {
            this.dataReserva = null;
            this.dataReservaPorExtenso = null;
        }
    }

    // Getters (existentes)
    public String getImagemCliente() { return imagemCliente; }
    public String getNomeCliente() { return nomeCliente; }
    public int getNota() { return nota; }
    public UUID getIdCliente() { return idCliente; }
    public String getComentario() { return comentario; }
    
    // <<< NOVOS GETTERS >>>
    public String getDataReserva() {
        return dataReserva;
    }
    public String getDataReservaPorExtenso() {
        return dataReservaPorExtenso;
    }
}