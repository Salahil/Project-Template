package TavolaSoftware.TavolaApp.REST.model; // Mantenha no pacote model

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "servicos_table", uniqueConstraints = @UniqueConstraint(columnNames = "servico_nome")) // Tabela 'servicos'
public class Servico { // Renomeado de Tags para Servico

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column (name = "servicos_id")
    private UUID id;

    @Column(name = "servico_nome", nullable = false, unique = true, length = 100)
    private String nome; // Renomeado de 'tag' para 'nome'

    // Relacionamento ManyToMany com Restaurante
    // mappedBy indica que a entidade Restaurante é dona do relacionamento
    @ManyToMany(mappedBy = "servicos")
    private Set<Restaurante> restaurantes = new HashSet<>();

    public Servico() {}

    public Servico(String nome) {
        this.nome = nome;
    }

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

    public Set<Restaurante> getRestaurantes() {
        return restaurantes;
    }

    public void setRestaurantes(Set<Restaurante> restaurantes) {
        this.restaurantes = restaurantes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Servico servico = (Servico) o;
        return Objects.equals(id, servico.id) && Objects.equals(nome, servico.nome);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nome);
    }

    @Override
    public String toString() {
        return "Servico{" +
               "id=" + id +
               ", nome='" + nome + '\'' +
               '}';
    }
}