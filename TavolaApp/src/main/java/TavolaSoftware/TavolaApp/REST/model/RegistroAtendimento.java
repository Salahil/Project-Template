package TavolaSoftware.TavolaApp.REST.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Entidade que armazena o histórico de um atendimento completo em uma mesa.
 * Serve como um "recibo" ou "log" de vendas e serviços.
 * Esta entidade é criada internamente quando um atendimento de mesa é finalizado.
 */
@Entity
@Table(name = "registro_atendimento")
public class RegistroAtendimento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurante_id", nullable = false)
    private Restaurante restaurante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mesa_id", nullable = false)
    private Mesa mesa;

    // Opcional: Se o atendimento foi vinculado a um cliente
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @Column(name = "nome_cliente") // Era nome_cliente_ocasional
    private String nomeCliente; // Guarda o nome se 'cliente' for nulo

    @Column(name = "hora_inicio", nullable = false)
    private LocalDateTime horaInicio; //

    @Column(name = "hora_fim", nullable = false)
    private LocalDateTime horaFim; // Momento em que a mesa foi fechada

    @Column(name = "valor_total")
    private Double valorTotal; //

    @ManyToMany
    @JoinTable(
        name = "registro_atendimento_pedidos",
        joinColumns = @JoinColumn(name = "registro_id"),
        inverseJoinColumns = @JoinColumn(name = "pedido_id")
    )
    private Set<Pedido> pedidos = new HashSet<>(); // Inicializar para evitar NullPointerException

    @ManyToMany
    @JoinTable(
        name = "registro_atendimento_garcons",
        joinColumns = @JoinColumn(name = "registro_id"),
        inverseJoinColumns = @JoinColumn(name = "garcom_id")
    )
    private Set<Garcom> garcons = new HashSet<>(); // Inicializar para evitar NullPointerException
    
    
    // Getters e Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Restaurante getRestaurante() { return restaurante; }
    public void setRestaurante(Restaurante restaurante) { this.restaurante = restaurante; }
    public Mesa getMesa() { return mesa; }
    public void setMesa(Mesa mesa) { this.mesa = mesa; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public LocalDateTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalDateTime horaInicio) { this.horaInicio = horaInicio; }
    public LocalDateTime getHoraFim() { return horaFim; }
    public void setHoraFim(LocalDateTime horaFim) { this.horaFim = horaFim; }
    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }

    // <<< GETTER/SETTER ATUALIZADO >>>
    public Set<Pedido> getPedidos() { return pedidos; }
    public void setPedidos(Set<Pedido> pedidos) { this.pedidos = pedidos; }
    
    // <<< GETTER/SETTER ATUALIZADO >>>
    public Set<Garcom> getGarcons() { return garcons; }
    public void setGarcons(Set<Garcom> garcons) { this.garcons = garcons; }

    // <<< GETTER/SETTER RENOMEADO >>>
    public String getNomeCliente() { return nomeCliente; }
    public void setNomeCliente(String nomeCliente) { this.nomeCliente = nomeCliente; }
}