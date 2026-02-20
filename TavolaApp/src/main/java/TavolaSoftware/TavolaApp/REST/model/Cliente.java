package TavolaSoftware.TavolaApp.REST.model;

import java.util.ArrayList; // Adicionado
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CollectionTable; // Adicionado
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection; // Adicionado
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType; // Adicionado (opcional, mas bom para coleções)
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "cliente_table")
public class Cliente {

    @Id
    private UUID id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ElementCollection(fetch = FetchType.LAZY) 
    @CollectionTable(name = "cliente_favoritos", joinColumns = @JoinColumn(name = "cliente_id"))
    @Column(name = "restaurante_id") 
    private List<UUID> favoritos = new ArrayList<>(); 
    
    
    
    public UUID getId() {
    	return id;
    }
    
    public void setId(UUID id) {
    	this.id = id;
    }
    
    public Usuario getUsuario() {
    	return usuario;
    }
    
    public void setUsuario(Usuario usuario) {
    	this.usuario = usuario;
    }

    public List<UUID> getFavoritos() {
        if (this.favoritos == null) { // Garante que a lista nunca seja nula ao ser acessada
            this.favoritos = new ArrayList<>();
        }
        return this.favoritos;
    }

    public void setFavoritos(List<UUID> favoritos) {
        this.favoritos = favoritos;
    }
}