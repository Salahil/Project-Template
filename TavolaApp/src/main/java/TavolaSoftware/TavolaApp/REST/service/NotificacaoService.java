package TavolaSoftware.TavolaApp.REST.service;

import TavolaSoftware.TavolaApp.REST.model.Cliente;
import TavolaSoftware.TavolaApp.REST.model.Notificacao;
import TavolaSoftware.TavolaApp.REST.model.Reserva;
import TavolaSoftware.TavolaApp.REST.repository.ClienteRepository;
import TavolaSoftware.TavolaApp.REST.repository.NotificacaoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class NotificacaoService {

    private static final int MAX_NOTIFICACOES_POR_CLIENTE = 20;

    @Autowired private NotificacaoRepository notificacaoRepository;
    @Autowired private ClienteRepository clienteRepository;

    /**
     * Cria uma nova notificação para um cliente após uma reserva ser concluída.
     * Implementa a regra de negócio de limitar as notificações.
     */
    @Transactional
    public void criarNotificacaoDeReservaConcluida(Reserva reserva) {
        Cliente cliente = reserva.getCliente();

        // Regra 4: Verifica o limite de notificações
        if (notificacaoRepository.countByClienteId(cliente.getId()) >= MAX_NOTIFICACOES_POR_CLIENTE) {
            // Se o limite foi atingido, busca e deleta a mais antiga
            notificacaoRepository.findFirstByClienteIdOrderByDataCriacaoAsc(cliente.getId())
                .ifPresent(notificacaoAntiga -> notificacaoRepository.delete(notificacaoAntiga));
        }

        // Cria e salva a nova notificação
        Notificacao novaNotificacao = new Notificacao();
        novaNotificacao.setCliente(cliente);
        novaNotificacao.setRestauranteId(reserva.getRestaurante().getId());
        novaNotificacao.setNomeRestaurante(reserva.getRestaurante().getUsuario().getNome());
        novaNotificacao.setDataReserva(reserva.getDataReserva());
        novaNotificacao.setDataCriacao(LocalDateTime.now());

        notificacaoRepository.save(novaNotificacao);
    }

    /**
     * Retorna todas as notificações pendentes para o cliente logado.
     */
    @Transactional(readOnly = true)
    public List<Notificacao> getNotificacoesDoCliente(String emailClienteLogado) {
        Cliente cliente = clienteRepository.findByUsuarioEmail(emailClienteLogado);
        if (cliente == null) {
            throw new EntityNotFoundException("Cliente não encontrado.");
        }
        return notificacaoRepository.findByClienteIdOrderByDataCriacaoDesc(cliente.getId());
    }

    /**
     * Deleta uma notificação após ser "vista" pelo cliente.
     * Inclui uma verificação de segurança para garantir que o cliente só apague suas próprias notificações.
     */
    @Transactional
    public void deletarNotificacao(UUID notificacaoId, String emailClienteLogado) {
        Notificacao notificacao = notificacaoRepository.findById(notificacaoId)
            .orElseThrow(() -> new EntityNotFoundException("Notificação não encontrada."));

        // Regra 2 (com segurança): Verifica se a notificação pertence ao cliente logado
        if (!notificacao.getCliente().getUsuario().getEmail().equals(emailClienteLogado)) {
            throw new SecurityException("Acesso negado. Você não tem permissão para deletar esta notificação.");
        }

        notificacaoRepository.delete(notificacao);
    }
}