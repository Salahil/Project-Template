package TavolaSoftware.TavolaApp.REST.controller;

import TavolaSoftware.TavolaApp.REST.dto.responses.RegistroAtendimentoResponse;
import TavolaSoftware.TavolaApp.REST.service.RegistroAtendimentoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Controlador para consultar o Histórico de Atendimentos e Vendas.
 * Expõe apenas endpoints GET (getAll, getById), como solicitado.
 * A criação destes registros é feita internamente por outros serviços.
 */
@RestController
@RequestMapping("/auth/api/restaurantes/{idRestaurante}/historico") //
public class RegistroAtendimentoController {

    @Autowired
    private RegistroAtendimentoService registroService;

    /**
     * GET /auth/api/restaurantes/{idRestaurante}/historico
     * Busca todo o histórico de atendimentos do restaurante.
     */
    @GetMapping
    public ResponseEntity<?> getAllHistorico(
            @PathVariable UUID idRestaurante
            // Não precisamos do idRestaurante no método, pois o serviço o pega do token,
            // mas é bom mantê-lo na URL para consistência da API REST.
    ) {
        try {
            List<RegistroAtendimentoResponse> historico = registroService.getAllByRestaurante();
            return ResponseEntity.ok(historico);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("erro", "Erro ao buscar histórico: " + e.getMessage()));
        }
    }

    /**
     * GET /auth/api/restaurantes/{idRestaurante}/historico/{id}
     * Busca um registro de atendimento específico pelo ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getHistoricoById(
            @PathVariable UUID idRestaurante,
            @PathVariable UUID id
    ) {
        try {
            RegistroAtendimentoResponse registro = registroService.getById(id);
            return ResponseEntity.ok(registro);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("erro", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("erro", "Erro ao buscar registro: " + e.getMessage()));
        }
    }
    
    // Como solicitado, não há POST, PUT ou DELETE.
}