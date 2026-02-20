package TavolaSoftware.TavolaApp.REST.service;

import TavolaSoftware.TavolaApp.REST.dto.requests.ReservaRequest;
import TavolaSoftware.TavolaApp.REST.dto.responses.CalendarioReservaResponse;
import TavolaSoftware.TavolaApp.REST.dto.responses.HistoricoResponse;
import TavolaSoftware.TavolaApp.REST.dto.responses.ReservaResponse;
import TavolaSoftware.TavolaApp.REST.model.Cliente;
import TavolaSoftware.TavolaApp.REST.model.Mesa;
import TavolaSoftware.TavolaApp.REST.model.Reserva;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.model.Usuario;
import TavolaSoftware.TavolaApp.REST.repository.ClienteRepository;
import TavolaSoftware.TavolaApp.REST.repository.MesaRepository;
import TavolaSoftware.TavolaApp.REST.repository.ReservaRepository;
import TavolaSoftware.TavolaApp.REST.repository.RestauranteRepository;
import TavolaSoftware.TavolaApp.REST.repository.UsuarioRepository;
import TavolaSoftware.TavolaApp.tools.StatusReserva;
import TavolaSoftware.TavolaApp.tools.TipoUsuario;
import TavolaSoftware.TavolaApp.REST.dto.responses.WebSocketMessage;
import TavolaSoftware.TavolaApp.tools.EventLabel;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Map;


@Service
public class ReservaService {

    @Autowired private ReservaRepository reservaRepository;
    @Autowired private ClienteRepository clienteRepository;
    @Autowired private RestauranteRepository restauranteRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private MesaRepository mesaRepository;
    @Autowired private NotificacaoService notificacaoService;
    @Autowired private AvaliacaoService avaliacaoService;
    @Autowired private SimpMessagingTemplate messagingTemplate;
    

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    @Transactional
    public Reserva criarReservaMock(Cliente cliente, Restaurante restaurante, Mesa mesa, 
                                    LocalDate dataReserva, LocalTime horaReserva, 
                                    int quantidadePessoas, StatusReserva status) {
        
        Reserva novaReserva = new Reserva();
        novaReserva.setCliente(cliente);
        novaReserva.setRestaurante(restaurante);
        novaReserva.setDataReserva(dataReserva);
        novaReserva.setHoraReserva(horaReserva);
        novaReserva.setQuantidadePessoas(quantidadePessoas);
        novaReserva.setStatus(status);
        novaReserva.setObservacoes("Reserva gerada por MockDataService.");
        novaReserva.setMesas(Collections.singletonList(mesa));
        
        // PULA A VALIDAÇÃO DE DATA/HORA PASSADA: validarDataHoraReserva(dataReserva, horaReserva);
        validarQuantidadePessoas(quantidadePessoas); // Mantém a validação de quantidade

        // Aqui ignoramos a lógica de limite de reservas para simplificar o mock

        return reservaRepository.save(novaReserva);
    }
    
    @Transactional
    public ReservaResponse criarReserva(ReservaRequest requestDto, String emailClienteLogado) {
        Cliente cliente = clienteRepository.findByUsuarioEmail(emailClienteLogado);
        if (cliente == null) {
            throw new RuntimeException("Cliente não encontrado com o email: " + emailClienteLogado);
        }

        Restaurante restaurante = restauranteRepository.findById(requestDto.getIdRestaurante())
                .orElseThrow(() -> new RuntimeException("Restaurante não encontrado com ID: " + requestDto.getIdRestaurante()));

        LocalDate dataReserva = parseData(requestDto.getDataReserva());
        LocalTime horaReserva = parseHora(requestDto.getHorarioReserva());
        
        Integer limite = restaurante.getLimiteReservasDiarias();
        if (limite != null && limite > 0) {
            long reservasNoDia = reservaRepository.countByRestauranteIdAndData(restaurante.getId(), dataReserva);
            if (reservasNoDia >= limite) {
                // Lança uma exceção específica que o Controller pode capturar com status 409 CONFLICT
                throw new IllegalStateException("O limite de reservas para este dia foi atingido.");
            }
        }
        
        validarDataHoraReserva(dataReserva, horaReserva);
        validarQuantidadePessoas(requestDto.getQuantidadePessoasReserva());
        
        Reserva novaReserva = new Reserva();
        novaReserva.setCliente(cliente);
        novaReserva.setRestaurante(restaurante);
        novaReserva.setDataReserva(dataReserva);
        novaReserva.setHoraReserva(horaReserva);
        novaReserva.setQuantidadePessoas(requestDto.getQuantidadePessoasReserva());
        novaReserva.setObservacoes(requestDto.getComentariosPreferenciaReserva());
        novaReserva.setStatus(StatusReserva.ATIVA);

        if (requestDto.getIdsMesas() != null && !requestDto.getIdsMesas().isEmpty()) {
            List<Mesa> mesasEncontradas = mesaRepository.findAllById(requestDto.getIdsMesas());
            if (mesasEncontradas.size() != requestDto.getIdsMesas().size()) {
                throw new RuntimeException("Uma ou mais mesas solicitadas para a reserva não foram encontradas.");
            }
            novaReserva.setMesas(mesasEncontradas);
        }
        
        Reserva reservaSalva = reservaRepository.save(novaReserva);
        ReservaResponse response = new ReservaResponse(reservaSalva);
        
        String topic = "/topic/restaurante/" + reservaSalva.getRestaurante().getId() + "/reservas";
        messagingTemplate.convertAndSend(topic, new WebSocketMessage(EventLabel.RESERVA_UPDATE_NEW, response));
        
        return new ReservaResponse(reservaSalva);
    }
    
    @Transactional(readOnly = true)
    public List<LocalDate> getDatasLotadas(UUID restauranteId) {
        Restaurante restaurante = restauranteRepository.findById(restauranteId)
            .orElseThrow(() -> new RuntimeException("Restaurante não encontrado."));
            
        Integer limite = restaurante.getLimiteReservasDiarias();
        // Se não há limite configurado, não há datas lotadas.
        if (limite == null || limite <= 0) {
            return Collections.emptyList();
        }

        // Busca todas as reservas a partir de hoje
        List<Reserva> reservasFuturas = reservaRepository.findByRestauranteIdAndDataReservaAfter(restauranteId, LocalDate.now().minusDays(1));

        // Usa a API de Streams do Java para:
        return reservasFuturas.stream()
            .collect(Collectors.groupingBy(Reserva::getDataReserva, Collectors.counting()))
            .entrySet().stream()
            .filter(entry -> entry.getValue() >= limite)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<HistoricoResponse> getHistorico(Usuario usuarioLogado) {
        // Garante que a lógica só prossiga se o usuário for um cliente
        if (usuarioLogado.getTipo() != TipoUsuario.CLIENTE) {
            return Collections.emptyList(); // Retorna lista vazia para qualquer outro tipo de usuário
        }

        // Busca as reservas do cliente
        List<Reserva> reservas = reservaRepository.findByClienteIdOrderByDataReservaDescHoraReservaDesc(usuarioLogado.getId());
        
        // Mapeia para o DTO de histórico do cliente
        return reservas.stream()
                .map(HistoricoResponse::new) // Usa o construtor simplificado que acabamos de deixar
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ReservaResponse> findReservasByRestauranteWithFilters(
            UUID restauranteId, String dataStr, String clienteNome, String statusStr) {

        LocalDate dataReserva = parseData(dataStr);

        String statusParaBusca = null;
        if (statusStr != null && !statusStr.isBlank() && !"todos".equalsIgnoreCase(statusStr)) {
            try {
                StatusReserva.valueOf(statusStr.toUpperCase());
                statusParaBusca = statusStr.toUpperCase();
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Status inválido: " + statusStr);
            }
        }
        
        String nomeParaBusca = (clienteNome != null && !clienteNome.isBlank()) ? clienteNome : null;

        List<Reserva> reservas = reservaRepository.findReservasByRestauranteWithFilters(
            restauranteId, dataReserva, nomeParaBusca, statusParaBusca);
        
        return reservas.stream()
                .filter(reserva -> reserva.getStatus() != StatusReserva.LISTA_ESPERA)
                .map(ReservaResponse::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ReservaResponse> findReservasListaEspera(UUID restauranteId) {
        List<Reserva> reservasEmEspera = reservaRepository.findByRestauranteIdAndStatusOrderByDataReservaAscHoraReservaAsc(
            restauranteId, StatusReserva.LISTA_ESPERA
        );
        return reservasEmEspera.stream().map(ReservaResponse::new).collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<CalendarioReservaResponse> findReservasParaCalendario(UUID restauranteId, String dataStr) {
        LocalDate dataRecebida = parseData(dataStr);
        YearMonth anoMes = YearMonth.from(dataRecebida);
        LocalDate dataInicio = anoMes.atDay(1);
        LocalDate dataFim = anoMes.atEndOfMonth();

        List<Reserva> reservasDoMes = reservaRepository.findByRestauranteIdAndDataReservaBetween(restauranteId, dataInicio, dataFim);

        return reservasDoMes.stream().map(CalendarioReservaResponse::new).collect(Collectors.toList());
    }
    
    @Transactional
    public ReservaResponse atualizarStatusReserva(UUID idReserva, String novoStatusStr, String emailUsuarioLogado) {
        // 1. Conversão e Validação do Status
        StatusReserva novoStatus;
        try {
            novoStatus = StatusReserva.valueOf(novoStatusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Status de reserva inválido: " + novoStatusStr);
        }

        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada com ID: " + idReserva));

        Usuario usuarioLogado = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new SecurityException("Usuário não autenticado."));
;
        if (usuarioLogado == null) {
            throw new SecurityException("Usuário não autenticado.");
        }

        if (usuarioLogado.getTipo() != TipoUsuario.RESTAURANTE || 
            !reserva.getRestaurante().getUsuario().getEmail().equals(emailUsuarioLogado)) {
            throw new SecurityException("Apenas o restaurante responsável pode alterar o status da reserva.");
        }
        
        if (reserva.getStatus() == StatusReserva.CONCLUIDA || 
            reserva.getStatus() == StatusReserva.CANCELADA_CLIENTE ||
            reserva.getStatus() == StatusReserva.CANCELADA_RESTAURANTE) {
            throw new IllegalStateException("Esta reserva já foi finalizada ou cancelada e não pode ter seu status alterado.");
        }

        reserva.setStatus(novoStatus);
        Reserva reservaAtualizada = reservaRepository.save(reserva);
        ReservaResponse response = new ReservaResponse(reservaAtualizada);
        
        String topic = "/topic/restaurante/" + reservaAtualizada.getRestaurante().getId() + "/reservas";
        messagingTemplate.convertAndSend(topic, new WebSocketMessage(EventLabel.RESERVA_UPDATE_STATUS, response));
        
        if (novoStatus == StatusReserva.CONCLUIDA) {
            avaliacaoService.enviarEmailLembreteAvaliacao(reservaAtualizada);
            notificacaoService.criarNotificacaoDeReservaConcluida(reservaAtualizada);
        }
        
        return new ReservaResponse(reservaAtualizada);
    }
    
    public Optional<ReservaResponse> findById(UUID idReserva) {
        return reservaRepository.findById(idReserva).map(ReservaResponse::new);
    }
    
    public List<ReservaResponse> findAllByClienteOrdered(UUID clienteId, String ordem, int pagina, int tamanho) {
        Pageable pageable = PageRequest.of(pagina, tamanho);
        List<Reserva> reservas = reservaRepository.findAllByClienteOrdered(clienteId, ordem, pageable);
        return reservas.stream().map(ReservaResponse::new).collect(Collectors.toList());
    }

    @Transactional
    public ReservaResponse cancelarReserva(UUID idReserva, String emailUsuarioLogado) {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada com ID: " + idReserva));

        Usuario usuarioLogado = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new SecurityException("Usuário não autenticado."));
usuarioRepository.findByEmail(emailUsuarioLogado);
        if (usuarioLogado == null) {
            throw new RuntimeException("Usuário não autenticado.");
        }

        boolean podeCancelar = false;
        StatusReserva novoStatus = reserva.getStatus();

        if (usuarioLogado.getTipo() == TipoUsuario.CLIENTE && reserva.getCliente().getUsuario().getEmail().equals(emailUsuarioLogado)) {
            podeCancelar = true;
            novoStatus = StatusReserva.CANCELADA_CLIENTE;
        } else if (usuarioLogado.getTipo() == TipoUsuario.RESTAURANTE && reserva.getRestaurante().getUsuario().getEmail().equals(emailUsuarioLogado)) {
            podeCancelar = true;
            novoStatus = StatusReserva.CANCELADA_RESTAURANTE;
        }

        if (!podeCancelar) {
            throw new SecurityException("Usuário não tem permissão para cancelar esta reserva.");
        }

        if (reserva.getStatus() == StatusReserva.CANCELADA_CLIENTE || reserva.getStatus() == StatusReserva.CANCELADA_RESTAURANTE || reserva.getStatus() == StatusReserva.CONCLUIDA) {
            throw new IllegalStateException("Esta reserva não pode ser cancelada pois já está " + reserva.getStatus().toString().toLowerCase() + ".");
        }
        
        reserva.setStatus(novoStatus);
        Reserva reservaSalva = reservaRepository.save(reserva);
        ReservaResponse response = new ReservaResponse(reservaSalva);
        
        String topic = "/topic/restaurante/" + reservaSalva.getRestaurante().getId() + "/reservas";
        messagingTemplate.convertAndSend(topic, new WebSocketMessage(EventLabel.RESERVA_UPDATE_STATUS, response));
        
        return new ReservaResponse(reservaSalva);
    }

    @Transactional
    public ReservaResponse atualizarReserva(UUID idReserva, ReservaRequest requestDto, String emailUsuarioLogado) {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada com ID: " + idReserva));

        Usuario usuarioLogado = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new SecurityException("Usuário não autenticado."));
        usuarioRepository.findByEmail(emailUsuarioLogado);
        if (usuarioLogado == null) {
            throw new RuntimeException("Usuário não autenticado.");
        }

        boolean temPermissao = (usuarioLogado.getTipo() == TipoUsuario.CLIENTE && reserva.getCliente().getUsuario().getEmail().equals(emailUsuarioLogado)) ||
                               (usuarioLogado.getTipo() == TipoUsuario.RESTAURANTE && reserva.getRestaurante().getUsuario().getEmail().equals(emailUsuarioLogado));

        if (!temPermissao) {
            throw new SecurityException("Usuário não tem permissão para atualizar esta reserva.");
        }

        StatusReserva statusOriginal = reserva.getStatus();
        if (statusOriginal == StatusReserva.CONCLUIDA || 
            statusOriginal == StatusReserva.CANCELADA_CLIENTE || 
            statusOriginal == StatusReserva.CANCELADA_RESTAURANTE ||
            statusOriginal == StatusReserva.NAO_COMPARECEU) {
             throw new IllegalStateException("Esta reserva não pode ser alterada pois seu status é '" + statusOriginal + "'.");
        }

        // --- LÓGICA DE ATUALIZAÇÃO AUTOMÁTICA DE STATUS ---
        boolean deveConfirmarAutomaticamente = false;
        if (statusOriginal == StatusReserva.LISTA_ESPERA && requestDto.getDataReserva() != null) {
            LocalDate novaData = parseData(requestDto.getDataReserva());
            if (!novaData.isEqual(reserva.getDataReserva())) {
                deveConfirmarAutomaticamente = true;
            }
        }
        // --- FIM DA LÓGICA ---

        if (requestDto.getDataReserva() != null) {
            reserva.setDataReserva(parseData(requestDto.getDataReserva()));
        }
        if (requestDto.getHorarioReserva() != null) {
            reserva.setHoraReserva(parseHora(requestDto.getHorarioReserva()));
        }
        if (requestDto.getQuantidadePessoasReserva() > 0) {
            reserva.setQuantidadePessoas(requestDto.getQuantidadePessoasReserva());
        }
        if (requestDto.getComentariosPreferenciaReserva() != null) {
            reserva.setObservacoes(requestDto.getComentariosPreferenciaReserva());
        }

        if (requestDto.getIdsMesas() != null) {
            if (requestDto.getIdsMesas().isEmpty()) {
                reserva.setMesas(Collections.emptyList());
            } else {
                List<Mesa> mesasEncontradas = mesaRepository.findAllById(requestDto.getIdsMesas());
                if (mesasEncontradas.size() != requestDto.getIdsMesas().size()) {
                    throw new RuntimeException("Uma ou mais mesas solicitadas para a atualização não foram encontradas.");
                }
                reserva.setMesas(mesasEncontradas);
            }
        }

        if (deveConfirmarAutomaticamente) {
            reserva.setStatus(StatusReserva.CONFIRMADA);
        }

        validarDataHoraReserva(reserva.getDataReserva(), reserva.getHoraReserva());
        validarQuantidadePessoas(reserva.getQuantidadePessoas());

        Reserva reservaAtualizada = reservaRepository.save(reserva);
        ReservaResponse response = new ReservaResponse(reservaAtualizada);
        
        String topic = "/topic/restaurante/" + reservaAtualizada.getRestaurante().getId() + "/reservas";
        messagingTemplate.convertAndSend(topic, new WebSocketMessage(EventLabel.RESERVA_UPDATE_MESA, response)); // Ou RESERVA_UPDATE_STATUS, dependendo do que mudou

        return new ReservaResponse(reservaAtualizada);
    }

    private LocalDate parseData(String dataStr) {
        try {
            return LocalDate.parse(dataStr, DATE_FORMATTER);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Formato de data inválido. Use aaaa-MM-dd.", e);
        }
    }

    private LocalTime parseHora(String horaStr) {
        try {
            return LocalTime.parse(horaStr, TIME_FORMATTER);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Formato de horário inválido. Use HH:mm.", e);
        }
    }
    
    private void validarDataHoraReserva(LocalDate data, LocalTime hora) {
        if (data.isBefore(LocalDate.now()) || (data.isEqual(LocalDate.now()) && hora.isBefore(LocalTime.now()))) {
            throw new IllegalArgumentException("Não é possível fazer ou alterar reservas para datas ou horários passados.");
        }
    }

    private void validarQuantidadePessoas(int qtd) {
        if (qtd <= 0) {
            throw new IllegalArgumentException("Quantidade de pessoas deve ser maior que zero.");
        }
    }
}