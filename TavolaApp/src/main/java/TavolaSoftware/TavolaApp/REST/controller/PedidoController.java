package TavolaSoftware.TavolaApp.REST.controller;

import TavolaSoftware.TavolaApp.REST.dto.requests.PedidoRequest;
import TavolaSoftware.TavolaApp.REST.dto.requests.StatusUpdateRequest;
import TavolaSoftware.TavolaApp.REST.dto.responses.PedidoResponse;
import TavolaSoftware.TavolaApp.REST.service.PedidoService;
import TavolaSoftware.TavolaApp.tools.PedidoStatus;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth/api/restaurantes/{idRestaurante}/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;
    
    @GetMapping("/ativos")
    public ResponseEntity<?> getTodosPedidosAtivos(@PathVariable UUID idRestaurante) {
        try {
            // Chama o novo método do serviço que busca por Restaurante, não por Mesa
            List<PedidoResponse> pedidos = pedidoService.findPedidosAtivosPorRestaurante(idRestaurante);
            return ResponseEntity.ok(pedidos);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("erro", "Erro ao buscar pedidos do restaurante: " + e.getMessage()));
        }
    }
    
    @PostMapping ("/{mesaId}/salvar")
    public ResponseEntity<?> criarPedido(@PathVariable UUID mesaId, @RequestBody PedidoRequest request) {
        try {
            // A lógica de extrair o garçom do token será feita no service
            var pedidoCriado = pedidoService.criarPedido(mesaId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(pedidoCriado); // Retorna o PedidoResponse
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/{idPedido}/status")
    public ResponseEntity<?> updatePedidoStatus(@PathVariable UUID idPedido, @RequestBody StatusUpdateRequest request) {
        try {
            var pedidoAtualizadoOpt = pedidoService.updateStatus(idPedido, request.getNovoStatus()); // Retorna Optional<Pedido>
            
            // Se o Optional contiver um pedido, significa que ele foi atualizado.
            // Se estiver vazio, significa que foi deletado (ENTREGUE/CANCELADO).
            
            // --- CORREÇÃO AQUI ---
            return pedidoAtualizadoOpt
                    // ANTES: .map(pedido -> ResponseEntity.ok(pedido))
                    // DEPOIS: Converte a entidade Pedido para o DTO PedidoResponse
                    .map(pedido -> ResponseEntity.ok(new PedidoResponse(pedido))) // <<< MUDANÇA
                    .orElseGet(() -> ResponseEntity.noContent().build()); // Mantém 204 se deletado
            // --- FIM DA CORREÇÃO ---

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", e.getMessage()));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage()));
        }
    }

	@PutMapping ("/{idPedido}/add")
	public ResponseEntity<?> adicionarRemoverItens(
            @PathVariable UUID idRestaurante, // Vem da URL principal
            @PathVariable UUID idPedido,
            @RequestBody PedidoRequest request // Reutilizando o DTO por enquanto
    ) {
		/*
		 * update do pedido, que adiciona ou remove a lista de itemPedido no pedido do usuario.
		 * */
         try {
            PedidoResponse pedidoAtualizado = pedidoService.adicionarRemoverItensPedido(idPedido, request);
             
            return ResponseEntity.ok(pedidoAtualizado);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", e.getMessage()));
        } catch (IllegalStateException e) {
             return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("erro", e.getMessage())); // Ex: Status não permite alteração
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage())); // Ex: Itens inválidos
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("erro", "Erro ao atualizar itens do pedido: " + e.getMessage()));
        }
	}
}