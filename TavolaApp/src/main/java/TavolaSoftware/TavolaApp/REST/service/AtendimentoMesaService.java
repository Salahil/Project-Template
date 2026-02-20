package TavolaSoftware.TavolaApp.REST.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import TavolaSoftware.TavolaApp.REST.model.AtendimentoMesa;
import TavolaSoftware.TavolaApp.REST.model.Cliente;
import TavolaSoftware.TavolaApp.REST.model.Garcom;
import TavolaSoftware.TavolaApp.REST.model.Mesa;
import TavolaSoftware.TavolaApp.REST.model.Pedido;
import TavolaSoftware.TavolaApp.REST.model.RegistroAtendimento;
import TavolaSoftware.TavolaApp.REST.repository.AtendimentoMesaRepository;
import TavolaSoftware.TavolaApp.REST.repository.GarcomRepository;
import TavolaSoftware.TavolaApp.REST.repository.MesaRepository;
import TavolaSoftware.TavolaApp.REST.repository.PedidoRepository;
import TavolaSoftware.TavolaApp.REST.repository.RegistroAtendimentoRepository;
import TavolaSoftware.TavolaApp.tools.MesaStatus;
import TavolaSoftware.TavolaApp.tools.PedidoStatus;
import jakarta.persistence.EntityNotFoundException;

@Service
public class AtendimentoMesaService {

    @Autowired private AtendimentoMesaRepository atendimentoRepository;
    @Autowired private MesaRepository mesaRepository;
    @Autowired private GarcomRepository garcomRepository;
    @Autowired private PedidoRepository pedidoRepository; // Para buscar pedidos ao finalizar
    @Autowired private RegistroAtendimentoRepository registroRepository; // Para salvar o histórico

    @Transactional
    public AtendimentoMesa iniciarAtendimentoMock(Mesa mesa, Garcom garcom) {
        
        AtendimentoMesa atendimento = atendimentoRepository.findAtendimentoAtivoByMesaId(mesa.getId())
                .orElseGet(() -> {
                    AtendimentoMesa novoAtendimento = new AtendimentoMesa();
                    novoAtendimento.setMesa(mesa);
                    novoAtendimento.setRestaurante(mesa.getAmbiente().getRestaurante());
                    novoAtendimento.setHoraInicio(LocalDateTime.now().minusMinutes(30)); // Inicia há 30 min atrás
                    novoAtendimento.setAtivo(true);
                    return novoAtendimento;
                });

        atendimento.getGarcons().add(garcom);
        
        if (mesa.getStatus() != MesaStatus.OCUPADA) {
            mesa.setStatus(MesaStatus.OCUPADA);
            mesaRepository.save(mesa); 
        }

        return atendimentoRepository.save(atendimento);
    }
    
    /**
     * Garçom registra que está iniciando o atendimento em uma mesa.
     * (Método sem alterações)
     */
    @Transactional
    public AtendimentoMesa iniciarAtendimento(UUID mesaId, UUID garcomId) {
        // ... (lógica existente de iniciarAtendimento)
        Mesa mesa = mesaRepository.findById(mesaId)
                .orElseThrow(() -> new EntityNotFoundException("Mesa não encontrada: " + mesaId));
        Garcom garcom = garcomRepository.findById(garcomId)
                .orElseThrow(() -> new EntityNotFoundException("Garçom não encontrado: " + garcomId));

        if (!mesa.getAmbiente().getRestaurante().getId().equals(garcom.getRestaurante().getId())) {
            throw new SecurityException("Acesso negado. O garçom não pertence ao restaurante desta mesa.");
        }
        
        AtendimentoMesa atendimento = atendimentoRepository.findAtendimentoAtivoByMesaId(mesaId)
                .orElseGet(() -> {
                    AtendimentoMesa novoAtendimento = new AtendimentoMesa();
                    novoAtendimento.setMesa(mesa);
                    novoAtendimento.setRestaurante(mesa.getAmbiente().getRestaurante());
                    novoAtendimento.setHoraInicio(LocalDateTime.now());
                    novoAtendimento.setAtivo(true);
                    return novoAtendimento;
                });

        atendimento.getGarcons().add(garcom);
        
        if (mesa.getStatus() != MesaStatus.OCUPADA) {
            mesa.setStatus(MesaStatus.OCUPADA);
            mesaRepository.save(mesa); 
        }

        return atendimentoRepository.save(atendimento);
    }

    /**
     * Finaliza a sessão de atendimento ativa de uma mesa.
     * (Método ATUALIZADO para usar nomeCliente)
     */
    @Transactional
    public void finalizarAtendimento(Mesa mesa) {
        AtendimentoMesa atendimento = atendimentoRepository.findAtendimentoAtivoByMesaId(mesa.getId())
                .orElse(null); 

        if (atendimento == null || !atendimento.isAtivo()) {
            // ... (código de fallback para garantir mesa LIVRE) ...
            System.out.println("Nenhum atendimento ativo encontrado para finalizar na mesa: " + mesa.getId());
            if(mesa.getStatus() != MesaStatus.LIVRE) {
                mesa.setStatus(MesaStatus.LIVRE);
                mesaRepository.save(mesa);
            }
            return; 
        }

        // 1. Marca o atendimento como inativo (sem alterações)
        atendimento.setAtivo(false);
        atendimento.setHoraFim(LocalDateTime.now());
        atendimentoRepository.save(atendimento);

        // 2. Coleta os dados (sem alterações)
        LocalDateTime inicio = atendimento.getHoraInicio();
        LocalDateTime fim = atendimento.getHoraFim();
        List<Pedido> pedidosDoAtendimento = pedidoRepository.findByMesaIdAndDataHoraBetweenAndStatusIn(
                mesa.getId(), inicio, fim, Set.of(PedidoStatus.ENTREGUE) 
        );
        double valorTotal = pedidosDoAtendimento.stream()
            .flatMap(p -> p.getItens().stream())
            .mapToDouble(item -> item.getPrecoUnitario() * item.getQuantidade())
            .sum();
        Set<Garcom> garconsDosPedidos = pedidosDoAtendimento.stream()
                .map(Pedido::getGarcom)
                .collect(Collectors.toSet());
        garconsDosPedidos.addAll(atendimento.getGarcons());

        // 3. Cria o RegistroAtendimento (sem alterações)
        RegistroAtendimento registro = new RegistroAtendimento();
        registro.setRestaurante(atendimento.getRestaurante());
        registro.setMesa(mesa);
        registro.setCliente(pedidosDoAtendimento.stream().map(Pedido::getCliente).filter(c -> c != null).findFirst().orElse(null));
        registro.setHoraInicio(inicio);
        registro.setHoraFim(fim);
        registro.setValorTotal(valorTotal);
        registro.setPedidos(new HashSet<>(pedidosDoAtendimento)); 
        registro.setGarcons(garconsDosPedidos); 
        
        // <<< LÓGICA DO NOME DO CLIENTE ATUALIZADA >>>
        Cliente clienteDoPedido = pedidosDoAtendimento.stream()
            .map(Pedido::getCliente)
            .filter(c -> c != null)
            .findFirst().orElse(null);
            
        if (clienteDoPedido != null) {
            registro.setCliente(clienteDoPedido);
            // ANTES: registro.setNomeClienteOcasional(null);
            registro.setNomeCliente(null); // DEPOIS
        } else {
            registro.setCliente(null);
            // ANTES: registro.setNomeClienteOcasional(atendimento.getNomeClienteOcasional());
            registro.setNomeCliente(atendimento.getNomeCliente()); // DEPOIS
        }
        // <<< FIM DA ATUALIZAÇÃO >>>

        registroRepository.save(registro);

        System.out.println("Atendimento finalizado e registro criado para mesa: " + mesa.getId());
    }

    /**
     * Busca o AtendimentoMesa ativo para uma dada mesa.
     * (Método sem alterações)
     */
    @Transactional(readOnly = true)
    public Optional<AtendimentoMesa> getAtendimentoAtivo(UUID mesaId) {
        return atendimentoRepository.findAtendimentoAtivoByMesaId(mesaId);
    }
    
    // <<< NOVO MÉTODO (Opção C) >>>
    @Transactional
    public AtendimentoMesa definirNomeCliente(UUID mesaId, String nomeCliente, UUID restauranteId) {
        
        // 1. Busca o atendimento ATIVO
        AtendimentoMesa atendimento = atendimentoRepository.findAtendimentoAtivoByMesaId(mesaId)
                .orElseThrow(() -> new EntityNotFoundException("Nenhum atendimento ativo encontrado para a mesa: " + mesaId));

        // 2. Validação de Segurança
        if (!atendimento.getRestaurante().getId().equals(restauranteId)) {
            throw new SecurityException("Acesso negado. O atendimento não pertence a este restaurante.");
        }

        // 3. Define o nome
        atendimento.setNomeCliente(nomeCliente);
        return atendimentoRepository.save(atendimento);
    }
}

// TODOs removidos conforme instruções