package TavolaSoftware.TavolaApp.REST.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import TavolaSoftware.TavolaApp.tools.StatusReserva;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "reserva_table") // O ideal seria renomear esta tabela para "reservas" no futuro (history_table)
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "reserva_id")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "restaurante_id", nullable = false)
    private Restaurante restaurante;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "reserva_mesas", // Nome da tabela de ligação que será criada
        joinColumns = @JoinColumn(name = "reserva_id"), inverseJoinColumns = @JoinColumn(name = "mesa_id"))
    private List<Mesa> mesas = new ArrayList<>(); // << O campo agora é uma LISTA de Mesas


    @Column(name = "data_reserva", nullable = false)
    private LocalDate dataReserva;
    
    @Column(name = "hora_reserva", nullable = false)
    private LocalTime horaReserva;

    @Column(name = "pessoas_reserva", nullable = false)
    private int quantidadePessoas;

    @Column(name = "observacoes_reserva", length = 500)
    private String observacoes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_reserva", nullable = false)
    private StatusReserva status;
    
 // <<< NOVO CAMPO >>>
    // Mapeia a avaliação associada a esta reserva
    @OneToOne(mappedBy = "reserva", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Avaliacao avaliacao;

    
    public Reserva() {
        this.status = StatusReserva.ATIVA;
    }

    // Getters e Setters

    // O getter e setter de 'mesa' agora usam o tipo correto 'Mesa'
    public List<Mesa> getMesas() {return mesas;}
    public void setMesas(List<Mesa> mesas) {this.mesas = mesas;}
    
    // ... O restante dos getters e setters permanece igual ...
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Restaurante getRestaurante() { return restaurante; }
    public void setRestaurante(Restaurante restaurante) { this.restaurante = restaurante; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public LocalDate getDataReserva() { return dataReserva; }
    public void setDataReserva(LocalDate dataReserva) { this.dataReserva = dataReserva; }
    public LocalTime getHoraReserva() { return horaReserva; }
    public void setHoraReserva(LocalTime horaReserva) { this.horaReserva = horaReserva; }
    public int getQuantidadePessoas() { return quantidadePessoas; }
    public void setQuantidadePessoas(int quantidadePessoas) { this.quantidadePessoas = quantidadePessoas; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public StatusReserva getStatus() { return status; }
    public void setStatus(StatusReserva status) { this.status = status; }
    
 // <<< NOVOS GETTERS/SETTERS >>>
    public Avaliacao getAvaliacao() {
        return avaliacao;
    }
    public void setAvaliacao(Avaliacao avaliacao) {
        this.avaliacao = avaliacao;
    }
}