package TavolaSoftware.TavolaApp.REST.controller;

import TavolaSoftware.TavolaApp.REST.dto.requests.AmbienteRequest;
import TavolaSoftware.TavolaApp.REST.dto.responses.AmbienteResponse;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.service.AmbienteService;
import TavolaSoftware.TavolaApp.REST.service.RestauranteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/auth/ambientes")
public class AmbienteController {

    @Autowired
    private AmbienteService ambienteService;

    @Autowired
    private RestauranteService restauranteService;

    /**
     * GET /auth/ambientes
     * Lista todos os ambientes do restaurante autenticado.
     */
    @GetMapping
    public ResponseEntity<List<AmbienteResponse>> listarAmbientes() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Restaurante restaurante = restauranteService.getByEmail(email);

        List<AmbienteResponse> ambientes = ambienteService.findAllByRestaurante(restaurante.getId());
        return ResponseEntity.ok(ambientes);
    }

    /**
     * GET /auth/ambientes/{id}
     * Busca um ambiente específico por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AmbienteResponse> getAmbientePorId(@PathVariable UUID id) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Restaurante restaurante = restauranteService.getByEmail(email);

        return ambienteService.findByIdAndRestaurante(id, restaurante.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /auth/ambientes
     * Cria um novo ambiente para o restaurante autenticado.
     */
    @PostMapping
    public ResponseEntity<AmbienteResponse> criarAmbiente(@RequestBody AmbienteRequest request) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Restaurante restaurante = restauranteService.getByEmail(email);

        AmbienteResponse ambienteCriado = ambienteService.create(request, restaurante);
        return ResponseEntity.status(HttpStatus.CREATED).body(ambienteCriado);
    }

    /**
     * PUT /auth/ambientes/{id}
     * Atualiza um ambiente existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AmbienteResponse> atualizarAmbiente(@PathVariable UUID id, @RequestBody AmbienteRequest request) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Restaurante restaurante = restauranteService.getByEmail(email);

        return ambienteService.update(id, request, restaurante.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /auth/ambientes/{id}
     * Deleta um ambiente existente.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAmbiente(@PathVariable UUID id) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Restaurante restaurante = restauranteService.getByEmail(email);

        boolean deletado = ambienteService.delete(id, restaurante.getId());

        if (deletado) {
            return ResponseEntity.noContent().build(); // HTTP 204
        } else {
            return ResponseEntity.notFound().build(); // HTTP 404
        }
    }
}