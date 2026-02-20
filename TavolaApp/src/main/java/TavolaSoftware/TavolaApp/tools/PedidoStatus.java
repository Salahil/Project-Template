package TavolaSoftware.TavolaApp.tools;

public enum PedidoStatus {
    PENDENTE,               // O cliente fez um pedido de item, aguardando ação
    EM_PREPARO,             // Status futuro para a Cozinha usar
    PRONTO,                 // Status futuro para a Cozinha usar
    ENTREGUE, 
    CANCELADO;               // O garçom entregou o item
}