package TavolaSoftware.TavolaApp.REST.repository;

import TavolaSoftware.TavolaApp.REST.model.Notificacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, UUID> {

    // Busca todas as notificações de um cliente, ordenadas da mais nova para a mais antiga
    List<Notificacao> findByClienteIdOrderByDataCriacaoDesc(UUID clienteId);

    // Conta quantas notificações um cliente possui (para a Regra 4)
    long countByClienteId(UUID clienteId);

    // Encontra a notificação mais antiga de um cliente (para a Regra 4)
    Optional<Notificacao> findFirstByClienteIdOrderByDataCriacaoAsc(UUID clienteId);
}