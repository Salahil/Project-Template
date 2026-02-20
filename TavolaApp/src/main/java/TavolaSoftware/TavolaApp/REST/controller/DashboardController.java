package TavolaSoftware.TavolaApp.REST.controller;

import TavolaSoftware.TavolaApp.REST.dto.responses.AmbienteDashboardResponse;
import TavolaSoftware.TavolaApp.REST.service.AmbienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth/api/restaurantes/{idRestaurante}/dashboard")
public class DashboardController {

    @Autowired
    private AmbienteService ambienteService;

    /**
     * GET /auth/api/restaurantes/{idRestaurante}/dashboard/ambientes
     *
     * Retorna a estrutura completa de Ambientes, Mesas (com status),
     * Atendimentos (todos) e Reservas (confirmadas) para o restaurante.
     *
    @GetMapping("/ambientes")
    public ResponseEntity<?> getDashboardCompletoAmbientes(
            @PathVariable UUID idRestaurante
    ) {
        // (Validação de segurança para garantir que o usuário logado
        // é deste restaurante pode ser adicionada aqui ou no serviço)
        
        try {
            List<AmbienteDashboardResponse> dashboard = ambienteService.getAmbienteDashboard(idRestaurante);
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            // Logar o erro (e.printStackTrace() ou logger)
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("erro", "Erro ao montar o dashboard: " + e.getMessage()));
        }
    }
    */
}