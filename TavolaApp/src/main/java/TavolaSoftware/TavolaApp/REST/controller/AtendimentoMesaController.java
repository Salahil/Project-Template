package TavolaSoftware.TavolaApp.REST.controller;

// <<< NOVO IMPORT >>>
import TavolaSoftware.TavolaApp.REST.dto.requests.NomeClienteRequest;
import TavolaSoftware.TavolaApp.REST.model.AtendimentoMesa;
import TavolaSoftware.TavolaApp.REST.model.Garcom;
import TavolaSoftware.TavolaApp.REST.security.JwtUtil;
import TavolaSoftware.TavolaApp.REST.service.AtendimentoMesaService;
import io.jsonwebtoken.Claims;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Controlador para gerenciar a sessão de atendimento ativa em uma mesa.
 */
@RestController
@RequestMapping("/auth/api/restaurantes/{idRestaurante}/mesas/{mesaId}/atendimento")
public class AtendimentoMesaController {

    @Autowired
    private AtendimentoMesaService atendimentoService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Endpoint para o GARÇOM logado indicar que está iniciando/juntando-se
     * ao atendimento de uma mesa específica.
     * (Método sem alterações)
     */
    @PutMapping("/iniciar") //
    public ResponseEntity<?> iniciarAtendimentoMesa(
            @PathVariable UUID idRestaurante,
            @PathVariable UUID mesaId
    ) {
        try {
            // ... (lógica existente do /iniciar)
            String token = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();
            Claims claims = jwtUtil.parseToken(token);
            UUID garcomId = UUID.fromString(claims.get("garcomId", String.class));
            UUID restauranteIdToken = UUID.fromString(claims.get("restauranteId", String.class));

            if (!idRestaurante.equals(restauranteIdToken)) {
                 return ResponseEntity.status(403).body(Map.of("erro", "Inconsistência entre URL e token de autenticação."));
            }

            AtendimentoMesa atendimento = atendimentoService.iniciarAtendimento(mesaId, garcomId);

            return ResponseEntity.ok(Map.of(
                    "mensagem", "Atendimento iniciado/atualizado para a mesa.",
                    "atendimentoId", atendimento.getId(),
                    "totalGarcons", atendimento.getGarcons().size()
            ));

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("erro", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("erro", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("erro", "Erro ao iniciar atendimento: " + e.getMessage()));
        }
    }

    /**
     * Busca o status do atendimento ativo da mesa.
     * (Método sem alterações)
     */
    @GetMapping("/status") //
    public ResponseEntity<?> getStatusAtendimento(@PathVariable UUID mesaId) {
         return atendimentoService.getAtendimentoAtivo(mesaId)
                 .map(atendimento -> ResponseEntity.ok(Map.of(
                         "atendimentoId", atendimento.getId(),
                         "ativo", atendimento.isAtivo(),
                         "horaInicio", atendimento.getHoraInicio(),
                         "garconsIds", atendimento.getGarcons().stream().map(Garcom::getId).collect(Collectors.toList())
                 )))
                 .orElse(ResponseEntity.ok(Map.of("ativo", false)));
    }
    
    // <<< NOVO ENDPOINT (Opção C) >>>
    /**
     * Endpoint para definir ou atualizar o nome do cliente (não cadastrado)
     * para o atendimento ATIVO.
     */
    @PutMapping("/nome-cliente")
    public ResponseEntity<?> setNomeCliente(
            @PathVariable UUID idRestaurante,
            @PathVariable UUID mesaId,
            @RequestBody NomeClienteRequest request) { // DTO renomeado
        
        try {
            // Validação de consistência do token (Restaurante ou Garçom)
            String token = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();
            Claims claims = jwtUtil.parseToken(token);
            UUID restauranteIdToken = UUID.fromString(claims.get("restauranteId", String.class));
            
            if (!idRestaurante.equals(restauranteIdToken)) {
                 return ResponseEntity.status(403).body(Map.of("erro", "Inconsistência entre URL e token de autenticação."));
            }
            
            // Chama o novo método no serviço
            AtendimentoMesa atendimento = atendimentoService.definirNomeCliente(
                    mesaId, 
                    request.getNomeCliente(), // Campo renomeado
                    restauranteIdToken
            );
            
            return ResponseEntity.ok(Map.of(
                    "mensagem", "Nome do cliente definido para este atendimento.",
                    "atendimentoId", atendimento.getId(),
                    "nomeCliente", atendimento.getNomeCliente() // Campo renomeado
            ));

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("erro", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("erro", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("erro", "Erro ao definir nome do cliente: " + e.getMessage()));
        }
    }
}