package TavolaSoftware.TavolaApp.REST.controller;

import TavolaSoftware.TavolaApp.REST.dto.responses.NotificacaoResponse; // Crie este DTO
import TavolaSoftware.TavolaApp.REST.model.Notificacao;
import TavolaSoftware.TavolaApp.REST.service.NotificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth/notificacoes")
public class NotificacaoController {

    @Autowired
    private NotificacaoService notificacaoService;

    /**
     * GET /auth/notificacoes
     * Retorna a lista de notificações de avaliação pendentes para o cliente logado.
     */
    @GetMapping
    public ResponseEntity<List<NotificacaoResponse>> getMinhasNotificacoes() {
        String emailCliente = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Notificacao> notificacoes = notificacaoService.getNotificacoesDoCliente(emailCliente);
        
        // Converte a lista de entidades para uma lista de DTOs antes de enviar
        List<NotificacaoResponse> response = notificacoes.stream()
            .map(NotificacaoResponse::new)
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /auth/notificacoes/{id}
     * Deleta uma notificação (quando o cliente clica/visualiza ela).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarNotificacao(@PathVariable UUID id) {
        try {
            String emailCliente = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            notificacaoService.deletarNotificacao(id, emailCliente);
            // Retorna 204 No Content, o padrão para um DELETE bem-sucedido
            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("erro", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("erro", e.getMessage()));
        }
    }
}