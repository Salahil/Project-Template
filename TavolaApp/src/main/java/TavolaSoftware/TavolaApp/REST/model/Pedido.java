package TavolaSoftware.TavolaApp.REST.model;

import TavolaSoftware.TavolaApp.tools.PedidoStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "pedido_table")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "data_hora_pedido", nullable = false)
    private LocalDateTime dataHora;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mesa_id", nullable = false)
    private Mesa mesa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "garcom_id", nullable = false)
    private Garcom garcom; // O garçom que registrou o pedido

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurante_id", nullable = false)
    private Restaurante restaurante;

    // O cliente é opcional. Útil para vincular a uma reserva, mas não obrigatório para um walk-in.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = true)
    private Cliente cliente;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itens = new ArrayList<>();
    
    @ManyToMany(mappedBy = "pedidos")
    private List<RegistroAtendimento> registrosDeAtendimento;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_pedido", nullable = false)
    private PedidoStatus status;

    // Getters e Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Mesa getMesa() { return mesa; }
    public void setMesa(Mesa mesa) { this.mesa = mesa; }
    public Garcom getGarcom() { return garcom; }
    public void setGarcom(Garcom garcom) { this.garcom = garcom; }
    public Restaurante getRestaurante() { return restaurante; }
    public void setRestaurante(Restaurante restaurante) { this.restaurante = restaurante; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public List<ItemPedido> getItens() { return itens; }
    public void setItens(List<ItemPedido> itens) { this.itens = itens; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public PedidoStatus getStatus() { return status; }
    public void setStatus(PedidoStatus status) { this.status = status; }
    public List<RegistroAtendimento> getRegistrosDeAtendimento() { return registrosDeAtendimento; }
    public void setRegistrosDeAtendimento(List<RegistroAtendimento> registrosDeAtendimento) { this.registrosDeAtendimento = registrosDeAtendimento; }
}