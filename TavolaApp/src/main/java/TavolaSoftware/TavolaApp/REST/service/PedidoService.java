package TavolaSoftware.TavolaApp.REST.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import io.jsonwebtoken.Claims;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import TavolaSoftware.TavolaApp.REST.dto.requests.PedidoRequest;
import TavolaSoftware.TavolaApp.REST.dto.responses.ItemPedidoResponse;
import TavolaSoftware.TavolaApp.REST.dto.responses.PedidoResponse;
import TavolaSoftware.TavolaApp.REST.dto.responses.WebSocketMessage;
import TavolaSoftware.TavolaApp.REST.model.Cardapio;
import TavolaSoftware.TavolaApp.REST.model.Cliente;
import TavolaSoftware.TavolaApp.REST.model.Garcom;
import TavolaSoftware.TavolaApp.REST.model.ItemPedido;
import TavolaSoftware.TavolaApp.REST.model.Mesa;
import TavolaSoftware.TavolaApp.REST.model.Pedido;
import TavolaSoftware.TavolaApp.REST.repository.CardapioRepository;
import TavolaSoftware.TavolaApp.REST.repository.ClienteRepository;
import TavolaSoftware.TavolaApp.REST.repository.GarcomRepository;
import TavolaSoftware.TavolaApp.REST.repository.MesaRepository;
import TavolaSoftware.TavolaApp.REST.repository.PedidoRepository;
import TavolaSoftware.TavolaApp.REST.security.JwtUtil;
import TavolaSoftware.TavolaApp.tools.EventLabel;
import TavolaSoftware.TavolaApp.tools.PedidoStatus;


@Service
public class PedidoService {

    @Autowired private PedidoRepository pedidoRepository;
    @Autowired private GarcomRepository garcomRepository;
    @Autowired private ClienteRepository clienteRepository;
    @Autowired private MesaRepository mesaRepository;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private SimpMessagingTemplate messagingTemplate;
    @Autowired private CardapioRepository cardapioRepository;
    @Autowired private AtendimentoMesaService atendimentoMesaService; 
    
    @Transactional
    public Pedido criarPedidoMock(Mesa mesa, Cliente cliente, Garcom garcom, Cardapio itemCardapio) {
        
        // 1. Cria e popula o Pedido
        Pedido novoPedido = new Pedido(); 
        novoPedido.setMesa(mesa); 
        novoPedido.setGarcom(garcom); 
        novoPedido.setRestaurante(mesa.getAmbiente().getRestaurante()); 
        novoPedido.setDataHora(LocalDateTime.now()); 
        novoPedido.setStatus(PedidoStatus.PENDENTE);
        novoPedido.setCliente(cliente);
        
        // Inicializa a lista como MUTÁVEL para o Hibernate funcionar corretamente
        novoPedido.setItens(new ArrayList<>()); 

        // 2. Cria o ItemPedido (snapshot)
        ItemPedido itemPedido = new ItemPedido();
        itemPedido.setPedido(novoPedido); // Vínculo bidirecional essencial
        itemPedido.setProdutoId(itemCardapio.getId()); 
        itemPedido.setNomeProduto(itemCardapio.getNome());
        itemPedido.setPrecoUnitario(itemCardapio.getPreco());
        itemPedido.setQuantidade(1);
        itemPedido.setObservacoes("Item de Mock.");
        
        // Adiciona à lista mutável
        novoPedido.getItens().add(itemPedido);
        
        // 3. Salva (O CascadeType.ALL na entidade Pedido cuidará de salvar o item)
        Pedido pedidoSalvo = pedidoRepository.save(novoPedido); 
        
        // 4. Notificação
        List<ItemPedidoResponse> itensEnriquecidos = mapearItensParaResposta(pedidoSalvo.getItens());
        PedidoResponse responseCompleto = new PedidoResponse(pedidoSalvo, itensEnriquecidos);
        String topic = "/topic/restaurante/" + pedidoSalvo.getRestaurante().getId() + "/pedidos"; 
        messagingTemplate.convertAndSend(topic, new WebSocketMessage(EventLabel.PEDIDO_UPDATE_NEW, responseCompleto)); 

        return pedidoSalvo;
    }
    
    @Transactional(readOnly = true)
    public List<PedidoResponse> findPedidosAtivosPorRestaurante(UUID restauranteId) {
        // Define quais status são considerados "Ativos" para o garçom/cozinha
        Set<PedidoStatus> statusAtivos = Set.of(
            PedidoStatus.PENDENTE,
            PedidoStatus.EM_PREPARO,
            PedidoStatus.PRONTO
        );

        // Busca no repositório
        List<Pedido> pedidos = pedidoRepository.findByRestauranteIdAndStatusInOrderByDataHoraAsc(
            restauranteId, 
            statusAtivos
        );

        // Converte para DTO usando o mapeamento enriquecido
        return pedidos.stream()
                .map(p -> {
                    List<ItemPedidoResponse> itens = mapearItensParaResposta(p.getItens());
                    return new PedidoResponse(p, itens);
                })
                .collect(Collectors.toList());
    }
    
    // NOVO MÉTODO DE MAPEAMENTO, ENRIQUECE OS ITENS COM A IMAGEM DO CARDAPIO
    private List<ItemPedidoResponse> mapearItensParaResposta(List<ItemPedido> itens) {
        if (itens == null) return new ArrayList<>();
        
        return itens.stream()
                .map(item -> {
                    // Busca a URL da imagem no repositório do Cardápio
                    String imagemUrl = null;
                    if (item.getProdutoId() != null) {
                        imagemUrl = cardapioRepository.findById(item.getProdutoId())
                                .map(Cardapio::getImagem)
                                .orElse(null);
                    }
                    
                    // Constrói o DTO do item enriquecido
                    return new ItemPedidoResponse(item, imagemUrl);
                })
                .collect(Collectors.toList());
    }
    
    // MÉTODO MODIFICADO (CORREÇÃO DO NPE "name is null")
    @Transactional(readOnly = true)
    public List<PedidoResponse> findPedidosAtivosPorMesa(UUID mesaId) {
        String token = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        Claims claims = jwtUtil.parseToken(token);
        
        // CORREÇÃO DE SEGURANÇA ROBUSTA
        // Tenta pegar o restauranteId da claim (Token de Garçom)
        String restIdStr = claims.get("restauranteId", String.class);
        UUID restauranteIdToken;

        if (restIdStr != null) {
            restauranteIdToken = UUID.fromString(restIdStr);
        } else {
            // Se for nulo, assume que é um login de RESTAURANTE (onde o ID do usuário é o ID do restaurante)
            // O 'subject' do token costuma ser o email, então precisamos buscar o usuário.
            // Para simplificar e evitar queries extras, vamos confiar que se a claim não existe,
            // ou é admin ou o acesso será barrado na verificação da mesa abaixo.
            // Tenta pegar o ID do usuário do Subject se o subject for um UUID (raro no seu caso, é email).
            // A melhor alternativa é lançar erro ou pegar do contexto se tivermos o ID do usuário carregado.
            // Vamos assumir que se não tem claim, não é garçom, então pode ser o dono.
            // Mas para validar a mesa, precisamos do ID.
            
            // Solução Padrão: Lança erro claro se não conseguir identificar
             throw new SecurityException("Token inválido: Não foi possível identificar o Restaurante no token.");
        }

        Mesa mesa = mesaRepository.findById(mesaId)
            .orElseThrow(() -> new EntityNotFoundException("Mesa não encontrada."));
            
        // Valida se a mesa pertence ao restaurante do token
        if (!mesa.getAmbiente().getRestaurante().getId().equals(restauranteIdToken)) {
            throw new SecurityException("Acesso negado. A mesa não pertence ao seu restaurante.");
        }

        // Define os status ativos
        Set<PedidoStatus> statusAtivos = Set.of(
            PedidoStatus.PENDENTE,
            PedidoStatus.EM_PREPARO,
            PedidoStatus.PRONTO
        ); 

        // Busca os pedidos
        List<Pedido> pedidosAtivos = pedidoRepository.findByMesaIdAndStatusInAndItensIsNotEmpty(mesaId, statusAtivos); 

        // Mapeia para DTOs
        return pedidosAtivos.stream()
                .map(pedido -> {
                    List<ItemPedidoResponse> itensEnriquecidos = mapearItensParaResposta(pedido.getItens());
                    return new PedidoResponse(pedido, itensEnriquecidos);
                })
                .collect(Collectors.toList()); 
    }
    
    @Transactional
    public PedidoResponse adicionarRemoverItensPedido(UUID idPedido, PedidoRequest request) {
        String token = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        Claims claims = jwtUtil.parseToken(token);
        
        // Mesma lógica de segurança robusta
        String restIdStr = claims.get("restauranteId", String.class);
        if (restIdStr == null) throw new SecurityException("Token inválido para esta operação.");
        UUID restauranteId = UUID.fromString(restIdStr);

        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new EntityNotFoundException("Pedido não encontrado: " + idPedido));
        
        if (!pedido.getRestaurante().getId().equals(restauranteId)) {
            throw new SecurityException("Acesso negado. O pedido não pertence ao seu restaurante.");
        }
        
        Set<PedidoStatus> statusBloqueados = Set.of(
            PedidoStatus.EM_PREPARO,
            PedidoStatus.PRONTO,
            PedidoStatus.ENTREGUE,
            PedidoStatus.CANCELADO
        ); 
        if (statusBloqueados.contains(pedido.getStatus())) {
             throw new IllegalStateException("Não é possível alterar itens de um pedido com status: " + pedido.getStatus());
        } 
        
        if (request.getItens() == null) {
             request.setItens(new ArrayList<>()); 
        }

        // LÓGICA DE ATUALIZAÇÃO (REPLACE)
        pedido.getItens().clear(); 

        List<ItemPedido> novosItens = request.getItens().stream().map(itemDto -> {
            Cardapio itemDeCardapio = cardapioRepository.findById(itemDto.getCardapioItemId())
                .orElseThrow(() -> new EntityNotFoundException("Item de cardápio não encontrado: " + itemDto.getCardapioItemId()));
            
            if (!itemDeCardapio.getRestaurante().getId().equals(restauranteId)) {
                throw new SecurityException("Item do cardápio não pertence a este restaurante.");
            }
            
            ItemPedido itemPedido = new ItemPedido();
            itemPedido.setPedido(pedido); 
            itemPedido.setProdutoId(itemDeCardapio.getId());
            itemPedido.setNomeProduto(itemDeCardapio.getNome());
            itemPedido.setPrecoUnitario(itemDeCardapio.getPreco());
            itemPedido.setQuantidade(itemDto.getQuantidade());
            itemPedido.setObservacoes(itemDto.getObservacao());
            return itemPedido;
        }).collect(Collectors.toList());

        pedido.getItens().addAll(novosItens); 
        
        if (pedido.getItens().isEmpty()) {
            pedido.setStatus(PedidoStatus.CANCELADO); 
            String topicCancel = "/topic/restaurante/" + restauranteId + "/pedidos";
            messagingTemplate.convertAndSend(topicCancel, new WebSocketMessage(EventLabel.PEDIDO_UPDATE_CANCEL, new PedidoResponse(pedido))); 
            pedidoRepository.delete(pedido); 
            
            List<ItemPedidoResponse> itensCancelados = mapearItensParaResposta(pedido.getItens());
            return new PedidoResponse(pedido, itensCancelados); 
        } else {
             Pedido pedidoAtualizado = pedidoRepository.save(pedido); 
             String topicUpdate = "/topic/restaurante/" + restauranteId + "/pedidos";
             
             List<ItemPedidoResponse> itensEnriquecidos = mapearItensParaResposta(pedidoAtualizado.getItens());
             PedidoResponse responseCompleto = new PedidoResponse(pedidoAtualizado, itensEnriquecidos);
             
             messagingTemplate.convertAndSend(topicUpdate, new WebSocketMessage(EventLabel.PEDIDO_UPDATE_NEW, responseCompleto)); 
             return responseCompleto; 
        }
    }
    
    @Transactional
    public Optional<Pedido> updateStatus(UUID idPedido, String novoStatusStr) {
        PedidoStatus novoStatus;
        try {
            novoStatus = PedidoStatus.valueOf(novoStatusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Status inválido: " + novoStatusStr);
        }
        
        String token = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        Claims claims = jwtUtil.parseToken(token);
        
        String restIdStr = claims.get("restauranteId", String.class);
        if (restIdStr == null) throw new SecurityException("Token inválido.");
        UUID restauranteIdToken = UUID.fromString(restIdStr);
        
        // Garçom ID pode vir do token se for login de garçom
        UUID garcomId = null;
        if (claims.get("garcomId") != null) {
             garcomId = UUID.fromString(claims.get("garcomId", String.class));
        }

        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new EntityNotFoundException("Pedido não encontrado: " + idPedido));
        
        if (!pedido.getRestaurante().getId().equals(restauranteIdToken)) {
            throw new SecurityException("Acesso negado.");
        }

        pedido.setStatus(novoStatus); 

        // Associa garçom se ENTREGUE e se quem está logado for um garçom
        if (novoStatus == PedidoStatus.ENTREGUE && garcomId != null) { 
            Garcom garcom = garcomRepository.findById(garcomId)
                .orElseThrow(() -> new EntityNotFoundException("Garçom não encontrado."));
            pedido.setGarcom(garcom); 
        }

        String topic = "/topic/restaurante/" + restauranteIdToken + "/pedidos"; 
        EventLabel eventLabel = (novoStatus == PedidoStatus.CANCELADO) ? EventLabel.PEDIDO_UPDATE_CANCEL : EventLabel.PEDIDO_UPDATE_NEW; 

        if (novoStatus == PedidoStatus.CANCELADO) { 
            messagingTemplate.convertAndSend(topic, new WebSocketMessage(eventLabel, new PedidoResponse(pedido))); 
            pedidoRepository.delete(pedido); 
            return Optional.empty(); 
        } else {
            Pedido pedidoAtualizado = pedidoRepository.save(pedido); 
            
            List<ItemPedidoResponse> itensEnriquecidos = mapearItensParaResposta(pedidoAtualizado.getItens());
            PedidoResponse responseCompleto = new PedidoResponse(pedidoAtualizado, itensEnriquecidos);

            messagingTemplate.convertAndSend(topic, new WebSocketMessage(eventLabel, responseCompleto)); 
            
            return Optional.of(pedidoAtualizado); 
        }
    }
    
    @Transactional
    public PedidoResponse criarPedido(UUID mesaId, PedidoRequest request) {
        String token = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        Claims claims = jwtUtil.parseToken(token);
        
        String restIdStr = claims.get("restauranteId", String.class);
        if (restIdStr == null) throw new SecurityException("Token inválido.");
        UUID restauranteId = UUID.fromString(restIdStr);
        
        UUID garcomId = UUID.fromString(claims.get("garcomId", String.class)); // Obrigatório ser garçom

        Garcom garcom = garcomRepository.findById(garcomId)
            .orElseThrow(() -> new EntityNotFoundException("Garçom não encontrado."));
        Mesa mesa = mesaRepository.findById(mesaId)
            .orElseThrow(() -> new EntityNotFoundException("Mesa não encontrada."));

        if (!mesa.getAmbiente().getRestaurante().getId().equals(restauranteId)) {
            throw new SecurityException("Acesso negado.");
        }

        atendimentoMesaService.getAtendimentoAtivo(mesaId)
            .orElseThrow(() -> new IllegalStateException("Não há um atendimento ativo nesta mesa."));

        Pedido novoPedido = new Pedido(); 
        novoPedido.setMesa(mesa); 
        novoPedido.setGarcom(garcom); 
        novoPedido.setRestaurante(mesa.getAmbiente().getRestaurante()); 
        novoPedido.setDataHora(LocalDateTime.now()); 
        novoPedido.setStatus(PedidoStatus.PENDENTE);
        
        // Inicializa lista mutável
        novoPedido.setItens(new ArrayList<>());
        
        if (request.getClienteId() != null) {
            Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado."));
            novoPedido.setCliente(cliente);
        }
        
        if (request.getItens() == null || request.getItens().isEmpty()) {
            throw new IllegalArgumentException("O pedido deve conter itens.");
        }
        
        List<ItemPedido> itensDoPedido = request.getItens().stream().map(itemDto -> {
            Cardapio itemDeCardapio = cardapioRepository.findById(itemDto.getCardapioItemId())
                .orElseThrow(() -> new EntityNotFoundException("Item de cardápio não encontrado."));
            
            if (!itemDeCardapio.getRestaurante().getId().equals(restauranteId)) {
                throw new SecurityException("Item inválido.");
            }
            
            ItemPedido itemPedido = new ItemPedido();
            itemPedido.setPedido(novoPedido); 
            itemPedido.setProdutoId(itemDeCardapio.getId()); 
            itemPedido.setNomeProduto(itemDeCardapio.getNome());
            itemPedido.setPrecoUnitario(itemDeCardapio.getPreco());
            itemPedido.setQuantidade(itemDto.getQuantidade());
            itemPedido.setObservacoes(itemDto.getObservacao());
            return itemPedido;
        }).collect(Collectors.toList());
        
        novoPedido.getItens().addAll(itensDoPedido);
        
        Pedido pedidoSalvo = pedidoRepository.save(novoPedido); 
        String topic = "/topic/restaurante/" + restauranteId + "/pedidos"; 
        
        List<ItemPedidoResponse> itensEnriquecidos = mapearItensParaResposta(pedidoSalvo.getItens());
        PedidoResponse responseCompleto = new PedidoResponse(pedidoSalvo, itensEnriquecidos);

        messagingTemplate.convertAndSend(topic, new WebSocketMessage(EventLabel.PEDIDO_UPDATE_NEW, responseCompleto)); 

        return responseCompleto; 
    }
}