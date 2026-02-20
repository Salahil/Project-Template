package TavolaSoftware.TavolaApp.REST.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Representa um ambiente dentro de um restaurante, como "Salão Principal" ou "Terraço".
 * Cada ambiente contém um conjunto de mesas.
 */
@Entity
@Table(name = "ambientes_table")
public class Ambiente {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ambientes_id")
    private UUID id;

    @Column(name = "nome_ambientes", nullable = false, length = 100)
    private String nome;

    // removemos a descrição

    // Relacionamento: Um Restaurante pode ter vários Ambientes.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurante_id", nullable = false)
    private Restaurante restaurante;

    // Relacionamento: Um Ambiente pode ter várias Mesas.
    // "mappedBy" indica que a entidade Mesa é a dona do relacionamento.
    // CascadeType.ALL faz com que as mesas sejam salvas/removidas junto com o ambiente.
    // orphanRemoval=true remove mesas que não estão mais associadas a este ambiente.
    @OneToMany(mappedBy = "ambiente", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Mesa> mesas = new ArrayList<>();

    // removemos a imagem
    
    // Getters e Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Restaurante getRestaurante() {
        return restaurante;
    }

    public void setRestaurante(Restaurante restaurante) {
        this.restaurante = restaurante;
    }

    public List<Mesa> getMesas() {
        return mesas;
    }

    public void setMesas(List<Mesa> mesas) {
        this.mesas = mesas;
    }
}