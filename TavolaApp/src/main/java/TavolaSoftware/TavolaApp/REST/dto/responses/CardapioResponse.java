package TavolaSoftware.TavolaApp.REST.dto.responses;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import TavolaSoftware.TavolaApp.REST.model.Cardapio;

public class CardapioResponse {
    private UUID id;
    private String nome;
    private Double preco;
    private String descricao;
    private String imagem;
    private boolean disponivel;
    private String categoria;
    private Set<String> tags;

    public CardapioResponse(Cardapio c) {
        this.id = c.getId();
        this.nome = c.getNome();
        this.preco = c.getPreco();
        this.descricao = c.getDescricao();
        this.imagem = c.getImagem();
        this.disponivel = c.getDisponivel();
        this.categoria = c.getCategoria().getNome();
        this.tags = c.getTags() != null ?
            c.getTags().stream().map(t -> t.getTag()).collect(Collectors.toSet()) :
            Set.of();
    }

    public UUID getId() {
    	return id;
    }
    
    public String getNome() {
    	return nome;
    }
    
    public double getPreco() {
    	return preco;
    }
    
    public String getDescricao() {
		return descricao;
	}
    
    public String getImagem() {
    	return imagem;
    }
    
    public boolean getDisponivel() {
    	return disponivel;
    }
    
    public String getCategoria() {
    	return categoria;
    }
    
    public Set<String> getTags(){
    	return tags;
    }
}



































