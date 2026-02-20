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

@Entity
@Table(name = "atendimento_mesa")
public class AtendimentoMesa {

    // ... (id) ...
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // <<< MUDANÇA AQUI: OneToOne -> ManyToOne >>>
    @ManyToOne(fetch = FetchType.LAZY)
    // <<< MUDANÇA AQUI: Remover unique = true >>>
    @JoinColumn(name = "mesa_id", nullable = false) // unique = true REMOVIDO
    private Mesa mesa;

    // ... (restaurante, garcons, ativo, horaInicio, horaFim - sem alterações) ...
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurante_id", nullable = false)
    private Restaurante restaurante;
    
    @ManyToMany
    @JoinTable(
        name = "atendimento_mesa_garcons",
        joinColumns = @JoinColumn(name = "atendimento_id"),
        inverseJoinColumns = @JoinColumn(name = "garcom_id")
    )
    private Set<Garcom> garcons = new HashSet<>(); 

    @Column(name = "ativo", nullable = false)
    private boolean ativo = true; 

    @Column(name = "hora_inicio", nullable = false)
    private LocalDateTime horaInicio; 

    @Column(name = "hora_fim")
    private LocalDateTime horaFim;
    
    @Column(name = "nome_cliente") // Era nome_cliente_ocasional
    private String nomeCliente; // Armazena o nome fornecido (se não houver Cliente associado)

    // Getters e Setters (sem alterações)
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Mesa getMesa() { return mesa; }
    public void setMesa(Mesa mesa) { this.mesa = mesa; }
    public Restaurante getRestaurante() { return restaurante; }
    public void setRestaurante(Restaurante restaurante) { this.restaurante = restaurante; }
    public Set<Garcom> getGarcons() { return garcons; }
    public void setGarcons(Set<Garcom> garcons) { this.garcons = garcons; }
    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }
    public LocalDateTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalDateTime horaInicio) { this.horaInicio = horaInicio; }
    public LocalDateTime getHoraFim() { return horaFim; }
    public void setHoraFim(LocalDateTime horaFim) { this.horaFim = horaFim; }
    public String getNomeCliente() { return nomeCliente; }
    public void setNomeCliente(String nomeCliente) { this.nomeCliente = nomeCliente; }
}