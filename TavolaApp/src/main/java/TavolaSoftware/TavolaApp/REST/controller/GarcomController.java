package TavolaSoftware.TavolaApp.REST.controller;

import TavolaSoftware.TavolaApp.REST.dto.requests.GarcomRequest;
import TavolaSoftware.TavolaApp.REST.dto.responses.GarcomResponse;
import TavolaSoftware.TavolaApp.REST.model.Garcom;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.service.GarcomService;
import TavolaSoftware.TavolaApp.REST.service.RestauranteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth/api/restaurantes/{idRestaurante}/garcons") // << Rota Padronizada
public class GarcomController {

    @Autowired
    private GarcomService garcomService;

    @Autowired
    private RestauranteService restauranteService;

    /**
     * Endpoint para o RESTAURANTE LOGADO criar um novo garçom para sua equipe.
     */
    @PostMapping
    public ResponseEntity<?> createGarcom(@PathVariable UUID idRestaurante, @RequestBody GarcomRequest request) {
        try {
            // VALIDAÇÃO DE SEGURANÇA: Garante que o restaurante logado só pode adicionar garçons a si mesmo.
            String emailRestauranteLogado = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Restaurante restauranteLogado = restauranteService.getByEmail(emailRestauranteLogado);

            if (!restauranteLogado.getId().equals(idRestaurante)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", "Você não tem permissão para gerenciar a equipe deste restaurante."));
            }

            Garcom novoGarcom = garcomService.createGarcom(request, idRestaurante);
            
            System.out.println("[CREATE_ENTITY] " + "{\n" + novoGarcom.toString() + "\n}");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(new GarcomResponse(novoGarcom));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * Endpoint para o RESTAURANTE LOGADO listar todos os seus garçons.
     */
    @GetMapping
    public ResponseEntity<?> getGarconsDoRestaurante(@PathVariable UUID idRestaurante) {
        try {
            // VALIDAÇÃO DE SEGURANÇA similar à de cima
            String emailRestauranteLogado = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Restaurante restauranteLogado = restauranteService.getByEmail(emailRestauranteLogado);

            if (!restauranteLogado.getId().equals(idRestaurante)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", "Você não tem permissão para ver a equipe deste restaurante."));
            }

            List<GarcomResponse> garcons = garcomService.findAllByRestaurante(idRestaurante).stream()
                    .map(GarcomResponse::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(garcons);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage()));
        }
    }
    
    /**
     * Endpoint para o RESTAURANTE LOGADO atualizar um garçom de sua equipe.
     */
    @PutMapping("/{idGarcom}")
    public ResponseEntity<?> updateGarcom(@PathVariable UUID idRestaurante, @PathVariable UUID idGarcom, @RequestBody GarcomRequest request) throws SecurityException {
        try {
            // VALIDAÇÃO DE SEGURANÇA
            String emailRestauranteLogado = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Restaurante restauranteLogado = restauranteService.getByEmail(emailRestauranteLogado);

            if (!restauranteLogado.getId().equals(idRestaurante)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", "Você não tem permissão para gerenciar a equipe deste restaurante."));
            }

            Garcom garcomAtualizado = garcomService.updateGarcom(idGarcom, request, idRestaurante);
            return ResponseEntity.ok(new GarcomResponse(garcomAtualizado));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{idGarcom}")
    public ResponseEntity<?> deleteGarcom(@PathVariable UUID idRestaurante, @PathVariable UUID idGarcom) throws SecurityException {
        try {
            // VALIDAÇÃO DE SEGURANÇA
            String emailRestauranteLogado = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Restaurante restauranteLogado = restauranteService.getByEmail(emailRestauranteLogado);

            if (!restauranteLogado.getId().equals(idRestaurante)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("erro", "Você não tem permissão para gerenciar a equipe deste restaurante."));
            }

            garcomService.deleteGarcom(idGarcom, idRestaurante); // <<< CHAMADA ATUALIZADA
            return ResponseEntity.noContent().build(); // Retorna 204 No Content, indicando sucesso

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", e.getMessage()));
        }
    }
}