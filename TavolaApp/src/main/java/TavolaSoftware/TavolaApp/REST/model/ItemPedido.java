package TavolaSoftware.TavolaApp.REST.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "item_pedido_table")
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @Column(name = "produto_id", nullable = false) // <-- CAMPO ADICIONADO
    private UUID produtoId; // Referência ao ID do item no Cardapio

    @Column(name = "nome_produto", nullable = false)
    private String nomeProduto;

    @Column(name = "preco_unitario", nullable = false) // <-- CAMPO ADICIONADO
    private double precoUnitario; // Preço do item no momento do pedido

    @Column(name = "quantidade", nullable = false)
    private int quantidade;

    @Column(name = "observacoes")
    private String observacoes;

    // Getters e Setters (com os novos adicionados)

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }

    public UUID getProdutoId() { return produtoId; } // <-- NOVO
    public void setProdutoId(UUID produtoId) { this.produtoId = produtoId; } // <-- NOVO

    public String getNomeProduto() { return nomeProduto; }
    public void setNomeProduto(String nomeProduto) { this.nomeProduto = nomeProduto; }

    public double getPrecoUnitario() { return precoUnitario; } // <-- NOVO
    public void setPrecoUnitario(double precoUnitario) { this.precoUnitario = precoUnitario; } // <-- NOVO

    public int getQuantidade() { return quantidade; }
    public void setQuantidade(int quantidade) { this.quantidade = quantidade; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}