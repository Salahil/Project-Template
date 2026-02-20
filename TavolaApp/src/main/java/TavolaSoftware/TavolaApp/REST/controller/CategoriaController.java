package TavolaSoftware.TavolaApp.REST.controller;

import TavolaSoftware.TavolaApp.REST.dto.responses.CategoriaResponse;
import TavolaSoftware.TavolaApp.REST.model.Categoria;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.service.CategoriaService;
import TavolaSoftware.TavolaApp.REST.service.RestauranteService;
import TavolaSoftware.TavolaApp.tools.ResponseExceptionHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService serv;

    @Autowired
    private RestauranteService restauranteService;

    // GET - self
    @GetMapping("/restaurante")
    public ResponseEntity<List<CategoriaResponse>> findSelfByRestaurante() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Restaurante restaurante = restauranteService.getByEmail(email);

        List<CategoriaResponse> resposta = serv.findByRestauranteId(restaurante.getId()).stream()
                .map(cat -> new CategoriaResponse(cat.getId(), cat.getNome()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(resposta);
    }

    // GET - all
    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> findAll() {
        List<CategoriaResponse> resposta = serv.findAll().stream()
                .map(cat -> new CategoriaResponse(cat.getId(), cat.getNome()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(resposta);
    }

    // GET - byId
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponse> findById(@PathVariable UUID id) {
        Optional<Categoria> categoria = serv.findById(id);
        return categoria
                .map(cat -> ResponseEntity.ok(new CategoriaResponse(cat.getId(), cat.getNome())))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST
    @PostMapping
    public ResponseEntity<?> save(@RequestBody Categoria categoria) {
        ResponseExceptionHandler handler = new ResponseExceptionHandler();

        handler.checkEmptyStrting("nome", categoria.getNome());

        if (handler.errors()) {
            return handler.generateResponse(HttpStatus.BAD_REQUEST);
        }

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Restaurante restaurante = restauranteService.getByEmail(email);
        categoria.setRestaurante(restaurante);

        Categoria salvo = serv.save(categoria);
        return ResponseEntity.ok(new CategoriaResponse(salvo.getId(), salvo.getNome()));
    }

    // PUT
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody Categoria categoria) {
        ResponseExceptionHandler handler = new ResponseExceptionHandler();

        handler.checkEmptyStrting("nome", categoria.getNome());

        if (handler.errors()) {
            return handler.generateResponse(HttpStatus.BAD_REQUEST);
        }

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Restaurante restaurante = restauranteService.getByEmail(email);
        categoria.setRestaurante(restaurante);

        Categoria atualizado = serv.update(id, categoria);
        return (atualizado != null)
                ? ResponseEntity.ok(new CategoriaResponse(atualizado.getId(), atualizado.getNome()))
                : ResponseEntity.notFound().build();
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        serv.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}