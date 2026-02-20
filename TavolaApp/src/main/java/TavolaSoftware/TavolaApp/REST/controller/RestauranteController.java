package TavolaSoftware.TavolaApp.REST.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import TavolaSoftware.TavolaApp.REST.dto.requests.PesquisaRequest;
import TavolaSoftware.TavolaApp.REST.dto.requests.RestauranteRequest;
import TavolaSoftware.TavolaApp.REST.dto.responses.ClienteHomeResponse;
import TavolaSoftware.TavolaApp.REST.dto.responses.RestauranteResponse;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.service.PesquisaService;
import TavolaSoftware.TavolaApp.REST.service.RestauranteService;

@RestController
@RequestMapping("/auth/restaurantes")
public class RestauranteController {

    @Autowired
    private RestauranteService servRestaurante;
    
    @Autowired
    private PesquisaService servPesquisa;
    
    /*
     * Método de pesquisa do cliente pesquisar por novos restaurantes.
     *  (pq está em restaurante? Simples! é porque ele retorna RESTAURANTES!)
     * */
    @PostMapping("/pesquisar") // Mudado para POST para aceitar um corpo de requisição com os filtros
    public ResponseEntity<List<ClienteHomeResponse>> pesquisarRestaurantes(@RequestBody PesquisaRequest request) {
        List<ClienteHomeResponse> resultados = servPesquisa.pesquisar(request);
        return ResponseEntity.ok(resultados);
    }

    /*
     * GET que retorna as informações do usuario logado, ele retorna as informações dele próprio
     *     - não use com o token de um cliente (não seja um bobão!)
     * */
    @GetMapping("/self")
    public ResponseEntity<RestauranteResponse> findSelf() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Restaurante restaurante = servRestaurante.getByEmail(email); 
        if (restaurante == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new RestauranteResponse(restaurante));
    }

    /*
     * GET para buscar as informações de todos os restaurantes, ela é tratada para retornar apenas
     *     as informações que são relevantes para o cliente, então não se assuste se vc não ver a cor
     *     da calçinha deles no response.
     * */
    @GetMapping
    public ResponseEntity<List<RestauranteResponse>> findAll() {
        List<RestauranteResponse> responses = servRestaurante.findAll();
        return ResponseEntity.ok(responses);
    }

    /*
     * GET esse aqui puxa todas as informações do restaurante!
     * */
    @GetMapping("/{id}")
    public ResponseEntity<RestauranteResponse> findById(@PathVariable UUID id) {
        return servRestaurante.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /*
     * PUT de update, ele atualiza... e é isso!
     * */
    @PutMapping("/update")
    public ResponseEntity<?> updateSelf(@RequestBody RestauranteRequest request) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Restaurante restauranteExistente = servRestaurante.getByEmail(email);

        if (restauranteExistente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro","Restaurante não encontrado para o usuário autenticado."));
        }

        try {
            Restaurante restauranteAtualizado = servRestaurante.updateFromRequest(restauranteExistente.getId(), request);
            return ResponseEntity.ok(new RestauranteResponse(restauranteAtualizado));
        } catch (RuntimeException e) {
             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", e.getMessage()));
        }
    }

    /*
     * PUT pra atualizar um maluco que não seja você, NÃO FAÇA ISSO, POR FAVOR...
     * */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateById(@PathVariable UUID id, @RequestBody RestauranteRequest request) {
        try {
            Restaurante restauranteAtualizado = servRestaurante.updateFromRequest(id, request);
            return ResponseEntity.ok(new RestauranteResponse(restauranteAtualizado));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("não encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro",e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro",e.getMessage()));
        }
    }

    /*
     * DELETE, vc se mata, curto e grosso, vc se mata
     * */
    @DeleteMapping
    public ResponseEntity<Void> deleteSelf() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Restaurante restaurante = servRestaurante.getByEmail(email);
        if (restaurante == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            servRestaurante.deleteById(restaurante.getId());
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /*
     * DELETE, vc mata alguém, menos aconselhável nesse contexto...
     * */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        try {
            servRestaurante.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("não encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}