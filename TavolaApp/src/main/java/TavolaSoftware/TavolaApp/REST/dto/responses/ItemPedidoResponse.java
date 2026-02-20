package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.ItemPedido;
import java.util.UUID;

// DTO para representar um item detalhado dentro de um pedido
public class ItemPedidoResponse {
    
    private UUID cardapioItemId; 
    private String nome;
    private Double valorUnitario; // Valor de apenas uma unidade do item
    private Integer quantidade;
    private String observacao;
    private String imagemUrl; // URL da imagem do item (INJETADA PELO SERVICE)
    private Double valorTotalItem; // Calculado: valorUnitario * quantidade

    // Construtor que recebe a Entidade ItemPedido e a URL da imagem injetada
    public ItemPedidoResponse(ItemPedido item, String imagemUrl) {
        this.cardapioItemId = item.getProdutoId();
        this.nome = item.getNomeProduto();
        this.valorUnitario = item.getPrecoUnitario();
        this.quantidade = item.getQuantidade();
        this.observacao = item.getObservacoes();
        
        this.imagemUrl = imagemUrl; 

        // Cálculo do valor total do item
        this.valorTotalItem = item.getPrecoUnitario() * item.getQuantidade();
    }

    // Getters
    public UUID getCardapioItemId() { return cardapioItemId; }
    public String getNome() { return nome; }
    public Double getValorUnitario() { return valorUnitario; }
    public Integer getQuantidade() { return quantidade; }
    public String getObservacao() { return observacao; }
    public String getImagemUrl() { return imagemUrl; }
    public Double getValorTotalItem() { return valorTotalItem; }

    // Setters (Mantido para flexibilidade)
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }
}