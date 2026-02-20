package TavolaSoftware.TavolaApp.REST.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import TavolaSoftware.TavolaApp.REST.dto.requests.ReservaRequest;
import TavolaSoftware.TavolaApp.REST.dto.requests.StatusUpdateRequest;
import TavolaSoftware.TavolaApp.REST.dto.responses.CalendarioReservaResponse;
import TavolaSoftware.TavolaApp.REST.dto.responses.HistoricoResponse;
import TavolaSoftware.TavolaApp.REST.dto.responses.ReservaResponse;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.model.Usuario;
import TavolaSoftware.TavolaApp.REST.repository.UsuarioRepository;
import TavolaSoftware.TavolaApp.REST.service.ReservaService;
import TavolaSoftware.TavolaApp.REST.service.RestauranteService;
import TavolaSoftware.TavolaApp.tools.ResponseExceptionHandler;
import TavolaSoftware.TavolaApp.tools.TipoUsuario;

@RestController
@RequestMapping("/auth/reservas")
public class ReservaController {

    @Autowired private ReservaService reservaService;
    @Autowired private RestauranteService restauranteService;
    @Autowired private UsuarioRepository usuarioRepository;

    @PostMapping("/save")
    public ResponseEntity<?> criarReserva(@RequestBody ReservaRequest reservaRequest) {
        // ... (lógica inalterada)
        ResponseExceptionHandler handler = new ResponseExceptionHandler();

        handler.checkUUID("ID do Restaurante (idRestaurante)", reservaRequest.getIdRestaurante());
        handler.checkEmptyStrting("Data da Reserva (dataReserva)", reservaRequest.getDataReserva());
        handler.checkEmptyStrting("Horário da Reserva (horarioReserva)", reservaRequest.getHorarioReserva());
        handler.checkMinimmumNumber("Quantidade de Pessoas (quantidadePessoasReserva)", reservaRequest.getQuantidadePessoasReserva(), 0);

        if (handler.errors()) {
            return handler.generateResponse(HttpStatus.BAD_REQUEST);
        }

        try {
        	String emailUsuarioLogado = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (emailUsuarioLogado == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("erro", "Usuário não autenticado."));
            }

            // --- CORREÇÃO AQUI ---
            Usuario usuarioLogado = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new RuntimeException("Detalhes do usuário não encontrados."));

            if (usuarioLogado == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("erro", "Detalhes do usuário não encontrados."));
            }

            if (usuarioLogado.getTipo() != TipoUsuario.CLIENTE) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                     .body(Map.of("erro", "Apenas clientes podem criar reservas. Usuários do tipo '" + usuarioLogado.getTipo() + "' não têm permissão."));
            }

            ReservaResponse reservaCriada = reservaService.criarReserva(reservaRequest, emailUsuarioLogado);
            return ResponseEntity.status(HttpStatus.CREATED).body(reservaCriada);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", e.getMessage()));
        } catch (SecurityException e) {
             return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("erro", e.getMessage()));
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().toLowerCase().contains("não encontrado")) {
                 return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("erro", "Erro interno ao processar a reserva: " + e.getMessage()));
        }
    }

    @GetMapping("/restaurante/{idRestaurante}")
    public ResponseEntity<?> listarReservasDoRestaurante(
            @PathVariable UUID idRestaurante,
            @RequestParam String data,
            @RequestParam(required = false) String clienteNome,
            @RequestParam(required = false, defaultValue = "todos") String status) {
        
        try {
            String emailUsuarioLogado = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Usuario usuarioLogado = usuarioRepository.findByEmail(emailUsuarioLogado)
                    .orElseThrow(() -> new RuntimeException("Detalhes do usuário não encontrados."));
            if (usuarioLogado.getTipo() != TipoUsuario.RESTAURANTE) {
                 return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                     .body(Map.of("erro", "Apenas usuários do tipo restaurante podem acessar este recurso."));
            }
            
            Restaurante restaurante = restauranteService.getByEmail(emailUsuarioLogado);
            if (!restaurante.getId().equals(idRestaurante)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                     .body(Map.of("erro", "Você não tem permissão para ver as reservas deste restaurante."));
            }

            List<ReservaResponse> reservas = reservaService.findReservasByRestauranteWithFilters(
                    idRestaurante, data, clienteNome, status);

                return ResponseEntity.ok(reservas);

            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", e.getMessage()));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("erro", "Erro ao buscar reservas: " + e.getMessage()));
            }
        }
    
    @GetMapping("/restaurante/{idRestaurante}/lista-espera")
    public ResponseEntity<?> listarListaDeEspera(@PathVariable UUID idRestaurante) {
        try {
             String emailUsuarioLogado = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
             Usuario usuarioLogado = usuarioRepository.findByEmail(emailUsuarioLogado)
                     .orElseThrow(() -> new RuntimeException("Detalhes do usuário não encontrados."));            if (usuarioLogado.getTipo() != TipoUsuario.RESTAURANTE) {
                 return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", "Apenas usuários do tipo restaurante podem acessar este recurso."));
            }
            Restaurante restaurante = restauranteService.getByEmail(emailUsuarioLogado);
            if (!restaurante.getId().equals(idRestaurante)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", "Você não tem permissão para ver a lista de espera deste restaurante."));
            }

            // <<< CORREÇÃO 2: A variável agora é do tipo correto para manter a clareza do código >>>
            List<ReservaResponse> reservas = reservaService.findReservasListaEspera(idRestaurante);
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("erro", "Erro ao buscar lista de espera: " + e.getMessage()));
        }
    }
    
    @GetMapping("/restaurante/{idRestaurante}/calendario")
    public ResponseEntity<?> listarReservasCalendario(
            @PathVariable UUID idRestaurante,
            @RequestParam String data) { 

        try {
             String emailUsuarioLogado = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
             Usuario usuarioLogado = usuarioRepository.findByEmail(emailUsuarioLogado)
                     .orElseThrow(() -> new RuntimeException("Detalhes do usuário não encontrados."));            if (usuarioLogado.getTipo() != TipoUsuario.RESTAURANTE) {
                 return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", "Apenas usuários do tipo restaurante podem acessar este recurso."));
            }
            Restaurante restaurante = restauranteService.getByEmail(emailUsuarioLogado);
            if (!restaurante.getId().equals(idRestaurante)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", "Você não tem permissão para ver o calendário deste restaurante."));
            }

            List<CalendarioReservaResponse> reservas = reservaService.findReservasParaCalendario(idRestaurante, data);
            return ResponseEntity.ok(reservas);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("erro", "Erro ao buscar dados do calendário: " + e.getMessage()));
        }
    }
    
    /**
     * NOVO ENDPOINT
     * Retorna o histórico de reservas para o usuário autenticado.
     * O formato da resposta varia se o usuário é um CLIENTE ou um RESTAURANTE.
     */
    @GetMapping("/meu-historico")
    public ResponseEntity<?> getMeuHistorico() {
        try {
        	String emailUsuarioLogado = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (emailUsuarioLogado == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("erro", "Usuário não autenticado."));
            }

            // --- CORREÇÃO AQUI ---
            Usuario usuarioLogado = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new RuntimeException("Detalhes do usuário não encontrados."));


            if (usuarioLogado == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("erro", "Usuário não autenticado ou não encontrado."));
            }

            // A lógica de serviço decide qual tipo de histórico retornar
            List<HistoricoResponse> historico = reservaService.getHistorico(usuarioLogado);
            return ResponseEntity.ok(historico);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("erro", "Ocorreu um erro ao buscar o histórico de reservas: " + e.getMessage()));
        }
    }

    @GetMapping("/{idReserva}")
    public ResponseEntity<?> buscarReservaPorId(@PathVariable("idReserva") UUID idReserva) { 
        Optional<ReservaResponse> reservaResponseOpt = reservaService.findById(idReserva); 
        return reservaResponseOpt 
                .<ResponseEntity<?>>map(ResponseEntity::ok) 
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", "Reserva não encontrada com ID: " + idReserva))); 
    }
    
    @PutMapping("/{idReserva}/status")
    public ResponseEntity<?> atualizarStatusReserva(@PathVariable UUID idReserva, @RequestBody StatusUpdateRequest statusRequest) {
        try {
            String emailUsuarioLogado = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            
            if (statusRequest.getNovoStatus() == null || statusRequest.getNovoStatus().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", "O campo 'novoStatus' é obrigatório."));
            }

            ReservaResponse reservaAtualizada = reservaService.atualizarStatusReserva(idReserva, statusRequest.getNovoStatus(), emailUsuarioLogado);
            return ResponseEntity.ok(reservaAtualizada);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("erro", e.getMessage()));
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().toLowerCase().contains("não encontrado")) {
                 return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage()));
            }

            if (e instanceof IllegalArgumentException) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("erro", "Erro ao atualizar status: " + e.getMessage()));
        }
    }

    @PutMapping("/{idReserva}/cancel")
    public ResponseEntity<?> cancelarReserva(@PathVariable("idReserva") UUID idReserva) { 
        try {
            String emailUsuarioLogado = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal(); 
            ReservaResponse reservaCancelada = reservaService.cancelarReserva(idReserva, emailUsuarioLogado); 
            return ResponseEntity.ok(reservaCancelada); 
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", e.getMessage())); 
        } catch (IllegalStateException e) { 
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("erro", e.getMessage())); 
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().toLowerCase().contains("não encontrado")) { 
                 return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage())); 
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("erro", "Erro ao cancelar reserva: " + e.getMessage())); 
        }
    }
    
    @PutMapping("/{idReserva}/update")
    public ResponseEntity<?> atualizarReserva(@PathVariable("idReserva") UUID idReserva, @RequestBody ReservaRequest reservaRequest) { 
        // O bloco de validação manual foi removido.
        // A validação de negócio agora é responsabilidade exclusiva do ReservaService.

        try {
            String emailUsuarioLogado = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal(); 
            ReservaResponse reservaAtualizada = reservaService.atualizarReserva(idReserva, reservaRequest, emailUsuarioLogado); 
            return ResponseEntity.ok(reservaAtualizada); 
        
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", e.getMessage())); 
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", e.getMessage())); 
        } catch (IllegalStateException e) { 
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("erro", e.getMessage())); 
        } catch (RuntimeException e) {
             if (e.getMessage() != null && e.getMessage().toLowerCase().contains("não encontrado")) { 
                 return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage())); 
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("erro", "Erro ao atualizar reserva: " + e.getMessage())); 
        }
    }
}