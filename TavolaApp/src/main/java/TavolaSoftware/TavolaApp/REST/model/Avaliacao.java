package TavolaSoftware.TavolaApp.REST.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne; // <<< ADICIONAR IMPORT
import jakarta.persistence.Table;
// import jakarta.persistence.UniqueConstraint; // <<< REMOVER IMPORT

@Entity
// <<< MUDANÇA AQUI: Remover a 'uniqueConstraints' >>>
// Agora a regra de unicidade será na 'reserva_id'
@Table(name = "cliente_avaliacao_table") 
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column (name = "avaliacao_id")
    private UUID id; 

    @ManyToOne 
    @JoinColumn(name = "restaurante_id", nullable = false) 
    private Restaurante restaurante;

    @ManyToOne 
    @JoinColumn(name = "cliente_id", nullable = false) 
    private Cliente cliente;
    
    // <<< NOVO CAMPO >>>
    // Ligação com a Reserva (uma avaliação por reserva)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserva_id", unique = true) // Garante que uma reserva só pode ser avaliada 1 vez
    private Reserva reserva; 

    @Column(name = "score_avaliacao", nullable = false)
    private int score;

    @Column(name = "comentario_avaliacao", length = 500)
    private String comentario;
    
    @Column(name = "sentimento_comentario", length = 20)
    private String sentimento;

    // Construtores
    public Avaliacao() {}

    // <<< CONSTRUTOR ATUALIZADO >>>
    public Avaliacao(Restaurante restaurante, Cliente cliente, int score, String comentario, Reserva reserva) {
        this.restaurante = restaurante;
        this.cliente = cliente;
        this.score = score;
        this.comentario = comentario;
        this.reserva = reserva; // <<< ADICIONAR RESERVA
    }

    // Getters e Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Restaurante getRestaurante() { return restaurante; }
    public void setRestaurante(Restaurante restaurante) { this.restaurante = restaurante; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
    public String getSentimento() { return sentimento; }
    public void setSentimento(String sentimento) { this.sentimento = sentimento; }
    
    // <<< NOVOS GETTERS/SETTERS >>>
    public Reserva getReserva() {
        return reserva;
    }
    public void setReserva(Reserva reserva) {
        this.reserva = reserva;
    }
}