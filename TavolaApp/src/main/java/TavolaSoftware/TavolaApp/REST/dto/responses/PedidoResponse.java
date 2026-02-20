package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.Pedido;
import TavolaSoftware.TavolaApp.tools.PedidoStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

// Este DTO representa um pedido para ser enviado via API ou WebSocket
public class PedidoResponse {
    private UUID id;
    private UUID mesaId;
    private String nomeMesa; 
    private String nomeGarcom;
    private LocalDateTime dataHora;
    private PedidoStatus status;
    private Double valorTotalPedido; 
    private List<ItemPedidoResponse> itens; 

    // Construtor principal (Agora aceita a lista de itens já ENRIQUECIDA com imagemUrl)
    public PedidoResponse(Pedido pedido, List<ItemPedidoResponse> itensEnriquecidos) {
        this.id = pedido.getId();
        
        // Mapeamento da Mesa (ID e Nome)
        if (pedido.getMesa() != null) {
            this.mesaId = pedido.getMesa().getId();
            this.nomeMesa = pedido.getMesa().getNome();
        } else {
            this.mesaId = null;
            this.nomeMesa = "Mesa Removida";
        }
        
        this.nomeGarcom = (pedido.getGarcom() != null) ? pedido.getGarcom().getNome() : "N/A";
        this.dataHora = pedido.getDataHora();
        this.status = pedido.getStatus();
        
        // Atribui a lista de itens já enriquecida pelo Service
        this.itens = itensEnriquecidos;
        
        // Cálculo do valor total do pedido com base nos itens enriquecidos
        this.valorTotalPedido = this.itens.stream()
                .mapToDouble(ItemPedidoResponse::getValorTotalItem)
                .sum();
    }
    
    // Construtor de fallback/simples (Para ser usado em outras partes, como WebSocket, 
    // onde a lista de itens não precisa ser enriquecida imediatamente. O Service terá que chamá-lo de forma segura).
    public PedidoResponse(Pedido pedido) {
         this(pedido, List.of()); // Chama o construtor principal com lista de itens vazia.
         // Nota: Este construtor é menos seguro para o endpoint GET /ativos, mas mantém a compatibilidade
         // com o código antigo do Service.
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getMesaId() { return mesaId; }
    public String getNomeMesa() { return nomeMesa; } 
    public String getNomeGarcom() { return nomeGarcom; }
    public LocalDateTime getDataHora() { return dataHora; }
    public PedidoStatus getStatus() { return status; }
    public Double getValorTotalPedido() { return valorTotalPedido; } 
    public List<ItemPedidoResponse> getItens() { return itens; } 

	public void setStatus(PedidoStatus status) {
		this.status = status;
	}
	
	// Setter adicionado para que o Service possa injetar os itens se for preciso
	public void setItens(List<ItemPedidoResponse> itens) {
	    this.itens = itens;
	}
	
	// Setter adicionado para que o Service possa injetar o valor total se for preciso
	public void setValorTotalPedido(Double valorTotalPedido) {
	    this.valorTotalPedido = valorTotalPedido;
	}
}