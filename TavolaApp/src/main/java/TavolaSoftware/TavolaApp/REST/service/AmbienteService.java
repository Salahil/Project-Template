package TavolaSoftware.TavolaApp.REST.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map; // <<< NOVO IMPORT
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import TavolaSoftware.TavolaApp.REST.dto.requests.AmbienteRequest;
import TavolaSoftware.TavolaApp.REST.dto.responses.AmbienteDashboardResponse;
import TavolaSoftware.TavolaApp.REST.dto.responses.AmbienteResponse;
import TavolaSoftware.TavolaApp.REST.dto.responses.AtendimentoSimplesResponse;
import TavolaSoftware.TavolaApp.REST.dto.responses.MesaDashboardResponse;
import TavolaSoftware.TavolaApp.REST.dto.responses.MesaResponse;
import TavolaSoftware.TavolaApp.REST.dto.responses.ReservaResponse;
import TavolaSoftware.TavolaApp.REST.dto.responses.ReservaSimplesResponse;
import TavolaSoftware.TavolaApp.REST.dto.responses.WebSocketMessage;
import TavolaSoftware.TavolaApp.REST.model.Ambiente;
import TavolaSoftware.TavolaApp.REST.model.AtendimentoMesa;
import TavolaSoftware.TavolaApp.REST.model.Mesa;
import TavolaSoftware.TavolaApp.REST.model.Reserva;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.repository.AmbienteRepository;
import TavolaSoftware.TavolaApp.REST.repository.AtendimentoMesaRepository;
import TavolaSoftware.TavolaApp.REST.repository.MesaRepository;
import TavolaSoftware.TavolaApp.REST.repository.ReservaRepository;
import TavolaSoftware.TavolaApp.tools.EventLabel;
import TavolaSoftware.TavolaApp.tools.StatusReserva;

@Service
public class AmbienteService {

    @Autowired
    private AmbienteRepository ambienteRepository;

    @Autowired
    private MesaRepository mesaRepository;

    @Autowired
    private AtendimentoMesaRepository atendimentoMesaRepository;

    @Autowired
    private ReservaRepository reservaRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate; // Para notificar o front da mudança
    
    
    
    /**
     * Busca a estrutura completa do dashboard... filtrada por DATA.
     *
     */
    @Transactional(readOnly = true)
    // <<< ASSINATURA ATUALIZADA >>>
    public List<AmbienteDashboardResponse> getAmbienteDashboard(UUID restauranteId, LocalDate data) {
        
        // 1. Busca todos os Ambientes do restaurante (sem alteração)
        List<Ambiente> ambientes = ambienteRepository.findByRestauranteId(restauranteId);
        if (ambientes.isEmpty()) {
            return List.of();
        }
        List<UUID> ambienteIds = ambientes.stream().map(Ambiente::getId).collect(Collectors.toList());

        // 2. Busca TODAS as Mesas de TODOS os ambientes (sem alteração)
        List<Mesa> todasAsMesas = mesaRepository.findByAmbienteIdIn(ambienteIds);
        if (todasAsMesas.isEmpty()) {
            return ambientes.stream()
                .map(amb -> new AmbienteDashboardResponse(amb, List.of()))
                .collect(Collectors.toList());
        }
        List<UUID> mesaIds = todasAsMesas.stream().map(Mesa::getId).collect(Collectors.toList());

        // 3. Busca Atendimentos (agora FILTRADOS PELA DATA)
        List<AtendimentoMesa> todosOsAtendimentos = atendimentoMesaRepository.findAtendimentosByMesaIdsAndData(mesaIds, data);
        
        // 4. Busca Reservas (agora FILTRADAS PELA DATA)
        //
        List<Reserva> todasAsReservas = reservaRepository.findReservasConfirmadasByMesaIdsAndData(mesaIds, data);

        // 5. Agrupa os dados em Mapas (lógica de agrupamento atualizada)
        Map<UUID, List<AtendimentoSimplesResponse>> atendimentosPorMesaId = todosOsAtendimentos.stream()
            .map(AtendimentoSimplesResponse::new)
            .collect(Collectors.groupingBy(AtendimentoSimplesResponse::getMesaId));
            
        // Mapeia reservas para todas as mesas em que elas aparecem
        Map<UUID, List<ReservaSimplesResponse>> reservasMapeadasPorMesaId = mesaIds.stream()
             .collect(Collectors.toMap(
                 mesaId -> mesaId, 
                 mesaId -> todasAsReservas.stream()
                             .filter(reserva -> reserva.getMesas().stream().anyMatch(m -> m.getId().equals(mesaId)))
                             .map(ReservaSimplesResponse::new)
                             .collect(Collectors.toList())
             ));

        Map<UUID, List<Mesa>> mesasPorAmbienteId = todasAsMesas.stream()
            .collect(Collectors.groupingBy(mesa -> mesa.getAmbiente().getId()));

        // 6. Monta a resposta final
        return ambientes.stream().map(ambiente -> {
            List<Mesa> mesasDoAmbiente = mesasPorAmbienteId.getOrDefault(ambiente.getId(), List.of());
            
            List<MesaDashboardResponse> mesasDashboard = mesasDoAmbiente.stream().map(mesa -> {
                UUID mesaId = mesa.getId();
                
                // Converte a entidade Mesa para o DTO (já pega o status ATUAL)
                MesaResponse mesaDto = MesaResponse.fromEntity(mesa);
                
                List<AtendimentoSimplesResponse> atendimentos = atendimentosPorMesaId.getOrDefault(mesaId, List.of());
                List<ReservaSimplesResponse> reservas = reservasMapeadasPorMesaId.getOrDefault(mesaId, List.of());
                
                // <<< LÓGICA DE STATUS (A Pedido) >>>
                //
                // Se a data for HOJE, o status "OCUPADA" (do AtendimentoAtivo) está correto.
                // Se a data for FUTURA, e a mesa estiver LIVRE, mas tiver reservas, muda para RESERVADA.
                if (!data.isEqual(LocalDate.now()) && 
                    mesaDto.getStatus().equals("LIVRE") && 
                    !reservas.isEmpty()) 
                {
                    mesaDto.setStatus("RESERVADA");
                }
                // (Se a data for passada, o status "LIVRE" é mantido, pois o atendimento já foi fechado)
                // <<< FIM DA LÓGICA DE STATUS >>>
                
                return new MesaDashboardResponse(mesaDto, atendimentos, reservas);
            }).collect(Collectors.toList());
            
            return new AmbienteDashboardResponse(ambiente, mesasDashboard);
        }).collect(Collectors.toList());
    }
    
    /**
     * Lista todos os ambientes de um restaurante específico.
     * (Método sem alterações)
     */
    @Transactional(readOnly = true)
    public List<AmbienteResponse> findAllByRestaurante(UUID restauranteId) {
        return ambienteRepository.findByRestauranteId(restauranteId).stream()
                .map(AmbienteResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Busca um ambiente específico pelo seu ID, garantindo que ele pertence ao restaurante.
     */
    @Transactional(readOnly = true)
    public Optional<AmbienteResponse> findByIdAndRestaurante(UUID ambienteId, UUID restauranteId) {
        return ambienteRepository.findById(ambienteId)
                .filter(ambiente -> ambiente.getRestaurante().getId().equals(restauranteId))
                .map(AmbienteResponse::new);
    }

    /**
     * Cria um novo ambiente para um restaurante.
     */
    @Transactional
    public AmbienteResponse create(AmbienteRequest request, Restaurante restaurante) {
        Ambiente novoAmbiente = new Ambiente();
        novoAmbiente.setNome(request.getNome());
        novoAmbiente.setRestaurante(restaurante);

        Ambiente ambienteSalvo = ambienteRepository.save(novoAmbiente);
        return new AmbienteResponse(ambienteSalvo);
    }

    /**
     * Atualiza um ambiente existente.
     */
    @Transactional
    public Optional<AmbienteResponse> update(UUID ambienteId, AmbienteRequest request, UUID restauranteId) {
        Optional<Ambiente> ambienteOpt = ambienteRepository.findById(ambienteId);

        // Verifica se o ambiente existe e pertence ao restaurante correto
        if (ambienteOpt.isEmpty() || !ambienteOpt.get().getRestaurante().getId().equals(restauranteId)) {
            return Optional.empty(); // Retorna vazio se não encontrado ou sem permissão
        }

        Ambiente ambienteExistente = ambienteOpt.get();
        ambienteExistente.setNome(request.getNome());
        // Outros campos como descrição poderiam ser atualizados aqui

        Ambiente ambienteAtualizado = ambienteRepository.save(ambienteExistente);
        return Optional.of(new AmbienteResponse(ambienteAtualizado));
    }

    /**
     * Deleta um ambiente e suas mesas (Cascade).
     * Reservas "vivas" associadas às mesas são desassociadas e movidas para a LISTA_ESPERA.
     */
    @Transactional
    public boolean delete(UUID ambienteId, UUID restauranteId) {
        // 1. Achar o ambiente e validar o dono
        Optional<Ambiente> ambienteOpt = ambienteRepository.findById(ambienteId);

        if (ambienteOpt.isEmpty() || !ambienteOpt.get().getRestaurante().getId().equals(restauranteId)) {
            // Se não achou ou não é o dono, falha
            return false;
        }
        
        Ambiente ambiente = ambienteOpt.get();

        // 2. Achar as mesas que serão excluídas (filhas do ambiente)
        List<Mesa> mesasParaDeletar = mesaRepository.findByAmbienteId(ambienteId);
        
        if (!mesasParaDeletar.isEmpty()) {
            List<UUID> mesaIds = mesasParaDeletar.stream().map(Mesa::getId).collect(Collectors.toList());
            
            // 3. Definir quais status de reserva devem ser "salvos"
            // (Não queremos salvar reservas CONCLUIDA ou CANCELADA)
            Set<StatusReserva> statusVivos = Set.of(
                StatusReserva.ATIVA, 
                StatusReserva.CONFIRMADA, 
                StatusReserva.PENDENTE,
                StatusReserva.LISTA_ESPERA // Mesmo que já esteja, processa para remover a mesa
            );
            
            // 4. Achar todas as reservas vivas afetadas (usando o novo método do repo)
            List<Reserva> reservasAfetadas = reservaRepository.findReservasByMesaIdsAndStatus(mesaIds, statusVivos);
            
            // 5. Processar as reservas (o resgate)
            for (Reserva reserva : reservasAfetadas) {
                // Remove a(s) mesa(s) que vão ser apagadas da lista da reserva
                reserva.getMesas().removeAll(mesasParaDeletar);
                
                // Joga a reserva na fila de espera
                //
                reserva.setStatus(StatusReserva.LISTA_ESPERA);
                
                Reserva reservaAtualizada = reservaRepository.save(reserva);
                
                // Notifica o front (dashboard do restaurante) que a reserva mudou
                String topic = "/topic/restaurante/" + restauranteId + "/reservas";
                messagingTemplate.convertAndSend(topic, new WebSocketMessage(EventLabel.RESERVA_UPDATE_STATUS, new ReservaResponse(reservaAtualizada)));
            }
        }
        
        // 6. Deletar o ambiente
        // (O CascadeType.ALL e orphanRemoval=true na entidade Ambiente [contexto anterior]
        // cuidará de apagar as Mesas automaticamente)
        ambienteRepository.deleteById(ambienteId);
        return true; // Sucesso
    }
}