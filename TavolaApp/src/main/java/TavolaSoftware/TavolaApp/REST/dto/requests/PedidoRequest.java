package TavolaSoftware.TavolaApp.REST.dto.requests;

import java.util.List;
import java.util.UUID;

public class PedidoRequest {

    private UUID clienteId; // Opcional: ID do cliente, se ele for identificado
    private List<ItemPedidoRequest> itens;

    // Classe interna para representar os itens do pedido
    public static class ItemPedidoRequest {
        private UUID cardapioItemId;
        private int quantidade;
        private String observacao;

        // Getters e Setters
        public UUID getCardapioItemId() { return cardapioItemId; }
        public void setCardapioItemId(UUID cardapioItemId) { this.cardapioItemId = cardapioItemId; }
        public int getQuantidade() { return quantidade; }
        public void setQuantidade(int quantidade) { this.quantidade = quantidade; }
        public String getObservacao() { return observacao; }
        public void setObservacao(String observacao) { this.observacao = observacao; }
    }

    // Getters e Setters
    public UUID getClienteId() { return clienteId; }
    public void setClienteId(UUID clienteId) { this.clienteId = clienteId; }
    public List<ItemPedidoRequest> getItens() { return itens; }
    public void setItens(List<ItemPedidoRequest> itens) { this.itens = itens; }
}