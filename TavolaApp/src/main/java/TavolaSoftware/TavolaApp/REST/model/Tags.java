package TavolaSoftware.TavolaApp.REST.model;

import java.util.Set;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "tags_table", uniqueConstraints = @UniqueConstraint(columnNames = "nome_tags"))
public class Tags {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "tags_id")
    private UUID id;

    @Column(name = "nome_tags", nullable = false, unique = true, length = 100)
    private String tag;

    @ManyToMany(mappedBy = "tags")
    private Set<Cardapio> cardapios;

    public Tags() {}

    public Tags(String tag) {
        this.tag = tag;
    }
    
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public Set<Cardapio> getCardapios() {
        return cardapios;
    }

    public void setCardapios(Set<Cardapio> cardapios) {
        this.cardapios = cardapios;
    }
}
