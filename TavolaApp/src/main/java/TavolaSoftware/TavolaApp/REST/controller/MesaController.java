package TavolaSoftware.TavolaApp.REST.controller;

import TavolaSoftware.TavolaApp.REST.dto.requests.MesaRequest;
import TavolaSoftware.TavolaApp.REST.dto.requests.StatusUpdateRequest;
import TavolaSoftware.TavolaApp.REST.dto.responses.MesaResponse;
import TavolaSoftware.TavolaApp.REST.model.Mesa;
import TavolaSoftware.TavolaApp.REST.service.MesaService;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/mesas") // Rota base para operações com mesas
public class MesaController {

    @Autowired
    private MesaService mesaService;
    
    /**
     * Endpoint para o GARÇOM (ou Balcão) atualizar o status de uma mesa.
     * Permite opcionalmente definir o nome do cliente se o status for OCUPADA.
     */
    @PutMapping("/{idMesa}/status")
    public ResponseEntity<?> updateMesaStatus(@PathVariable UUID idMesa, @RequestBody StatusUpdateRequest request) {
        try {
            // --- CORREÇÃO AQUI ---
            // ANTES: Mesa mesaAtualizada = mesaService.updateStatus(idMesa, request.getNovoStatus());
            // DEPOIS: Passamos o DTO completo (request) para o serviço
            Mesa mesaAtualizada = mesaService.updateStatus(idMesa, request);
            // --- FIM DA CORREÇÃO ---
            
            return ResponseEntity.ok(MesaResponse.fromEntity(mesaAtualizada));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", e.getMessage()));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * Endpoint para criar uma nova mesa dentro de um ambiente.
     * POST /auth/mesas/ambiente/{idAmbiente}
     * (Sem alterações)
     */
    @PostMapping("/ambiente/{idAmbiente}")
    public ResponseEntity<MesaResponse> createMesa(@PathVariable UUID idAmbiente, @RequestBody MesaRequest request) {
        Mesa novaMesa = mesaService.createMesa(request, idAmbiente);
        return ResponseEntity.status(201).body(MesaResponse.fromEntity(novaMesa));
    }

    /**
     * Endpoint para atualizar uma mesa existente.
     * PUT /auth/mesas/{idMesa}
     * (Sem alterações)
     */
    @PutMapping("/{idMesa}")
    public ResponseEntity<MesaResponse> updateMesa(@PathVariable UUID idMesa, @RequestBody MesaRequest request) {
        Mesa mesaAtualizada = mesaService.updateMesa(idMesa, request);
        return ResponseEntity.ok(MesaResponse.fromEntity(mesaAtualizada));
    }

    /**
     * Endpoint para deletar uma mesa.
     * DELETE /auth/mesas/{idMesa}
     * (Sem alterações)
     */
    @DeleteMapping("/{idMesa}")
    public ResponseEntity<Void> deleteMesa(@PathVariable UUID idMesa) {
        mesaService.deleteMesa(idMesa);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
    }
    
    /**
     * Endpoint para listar todas as mesas de um ambiente.
     * GET /auth/mesas/ambiente/{idAmbiente}
     * (Sem alterações)
     */
    @GetMapping("/ambiente/{idAmbiente}")
    public ResponseEntity<List<MesaResponse>> getMesasPorAmbiente(@PathVariable UUID idAmbiente) {
        List<MesaResponse> mesas = mesaService.getMesasByAmbiente(idAmbiente)
                .stream()
                .map(MesaResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(mesas);
    }
}