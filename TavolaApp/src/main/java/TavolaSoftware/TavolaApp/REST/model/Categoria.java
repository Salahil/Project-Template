package TavolaSoftware.TavolaApp.REST.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "restaurante_categoria")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "categoria_id")
    private UUID id;

    @Column(name = "nome_categoria", nullable = false, length = 500)
    private String nome;

    @ManyToOne
    @JoinColumn(name = "restaurante_id", nullable = false)
    private Restaurante restaurante;

    // Getters e Setters
    
    public UUID getId() {
    	return id;
    }
    
    public String getNome() {
    	return nome;
    }
    
    public Restaurante getRestaurante() {
    	return restaurante;
    }
    
    public void setId(UUID id) {
    	this.id = id;
    }
    
    public void setNome(String nome) {
    	this.nome = nome;
    }
    
    public void setRestaurante(Restaurante restaurante) {
    	this.restaurante = restaurante;
    }
}

