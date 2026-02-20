package TavolaSoftware.TavolaApp.REST.repository;

import TavolaSoftware.TavolaApp.REST.model.Pedido;
import TavolaSoftware.TavolaApp.tools.PedidoStatus; // Importar o Enum
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List; // Importar List
import java.util.Optional; // Importar Optional
import java.util.Set; // Importar Set
import java.util.UUID;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, UUID> {

    /**
     * Encontra o primeiro pedido de uma mesa, com um status específico, e que NÃO tenha itens.
     * (Usado para encontrar chamados de "AGUARDANDO_ATENDIMENTO").
     */
    Optional<Pedido> findFirstByMesaIdAndStatusAndItensIsEmpty(UUID mesaId, PedidoStatus status);

    /**
     * Encontra o primeiro pedido de uma mesa, atendido por um garçom específico, com um status específico,
     * e que NÃO tenha itens.
     * (Usado para encontrar o "ATENDIMENTO" ativo do garçom para liberar a mesa).
     */
    Optional<Pedido> findFirstByMesaIdAndGarcomIdAndStatusAndItensIsEmpty(UUID mesaId, UUID garcomId, PedidoStatus status);

    /**
     * Encontra todos os pedidos de uma mesa, que estejam em um dos status fornecidos,
     * e que TENHAM itens.
     * (Usado para buscar pedidos "ativos" da mesa: PENDENTE, EM_PREPARO, PRONTO).
     */
    List<Pedido> findByMesaIdAndStatusInAndItensIsNotEmpty(UUID mesaId, Set<PedidoStatus> statusAtivos);
    
    List<Pedido> findByRestauranteIdAndStatusInOrderByDataHoraAsc(UUID restauranteId, Collection<PedidoStatus> status);

	List<Pedido> findByMesaIdAndDataHoraBetweenAndStatusIn(UUID id, LocalDateTime inicio, LocalDateTime fim,
			Set<PedidoStatus> of);
}