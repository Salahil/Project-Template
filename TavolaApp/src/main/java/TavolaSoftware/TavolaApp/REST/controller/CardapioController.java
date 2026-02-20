package TavolaSoftware.TavolaApp.REST.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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

import TavolaSoftware.TavolaApp.REST.dto.responses.CardapioResponse;
import TavolaSoftware.TavolaApp.REST.dto.responses.PublicCardapioResponse;
import TavolaSoftware.TavolaApp.REST.dto.responses.RestauranteResponse;
import TavolaSoftware.TavolaApp.REST.model.Cardapio;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.service.CardapioService;
import TavolaSoftware.TavolaApp.REST.service.RestauranteService;
import TavolaSoftware.TavolaApp.tools.ResponseExceptionHandler;
import TavolaSoftware.TavolaApp.tools.UploadUtils;

@RestController
@RequestMapping("/auth/cardapios")
public class CardapioController {

    @Autowired private CardapioService serv; 
    @Autowired private RestauranteService restauranteServ;
    @Autowired private UploadUtils uplUtil;


    // GET - self
    @GetMapping 
    public ResponseEntity<List<CardapioResponse>> findAllSelf() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Restaurante restaurante = restauranteServ.getByEmail(email);
        List<Cardapio> cardapios = serv.findByRestauranteId(restaurante.getId());
        List<CardapioResponse> response = cardapios.stream().map(CardapioResponse::new).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para um CLIENTE ver os itens disponíveis no cardápio de um restaurante específico.
     * @param restauranteId O ID do restaurante a ser consultado (vindo da URL).
     * @return Uma lista de itens de cardápio disponíveis.
     */
    @GetMapping("/disponiveis/{restauranteId}")
    public ResponseEntity<List<CardapioResponse>> findAllByDisponivel(@PathVariable UUID restauranteId) {
        // 1. A lógica agora usa o 'restauranteId' que vem diretamente da URL.
        List<Cardapio> cardapios = serv.findAllByDisponivel(restauranteId);

        // 2. O restante da lógica para converter o resultado para o DTO de resposta permanece o mesmo.
        List<CardapioResponse> response = cardapios.stream()
                                                    .map(CardapioResponse::new)
                                                    .collect(Collectors.toList());
                                                    
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/public/{restauranteId}")
    public ResponseEntity<?> getPublicCardapioCompleto(@PathVariable UUID restauranteId) {
        
        // 1. Usamos nosso novo método helper para buscar a ENTIDADE Restaurante.
        Optional<Restaurante> restauranteOpt = restauranteServ.findEntityById(restauranteId);

        // 2. Verificamos se o restaurante foi encontrado.
        if (restauranteOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(Map.of("erro", "Restaurante não encontrado com o ID fornecido."));
        }
        
        // Se foi encontrado, podemos pegar o objeto com segurança.
        Restaurante restaurante = restauranteOpt.get();

        // 3. Buscamos a lista de itens do cardápio (lógica que já funcionava).
        List<Cardapio> cardapiosDisponiveis = serv.findAllByDisponivel(restauranteId);

        // 4. Convertemos a lista de entidades Cardapio para DTOs CardapioResponse.
        List<CardapioResponse> cardapioResponseList = cardapiosDisponiveis.stream()
                                                            .map(CardapioResponse::new)
                                                            .collect(Collectors.toList());

        String urlImagemUsuario = uplUtil.construirUrlRelativa("usuarios", restaurante.getUsuario().getImagem());
        
        // 5. Montamos a resposta final no formato que o Sérgio pediu.
        PublicCardapioResponse response = new PublicCardapioResponse(
            restaurante.getUsuario().getNome(),
            urlImagemUsuario,
            cardapioResponseList
        );

        // 6. Retornamos o pacote completo.
        return ResponseEntity.ok(response);
    }

    // GET - byId    
    @GetMapping("/restaurante/{restauranteId}") 
    public ResponseEntity<List<CardapioResponse>> findAllByRestaurante(@PathVariable UUID restauranteId) {
        List<Cardapio> cardapios = serv.findByRestauranteId(restauranteId);
        List<CardapioResponse> response = cardapios.stream().map(CardapioResponse::new).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardapioResponse> findById(@PathVariable UUID id) {
        Optional<Cardapio> cardapio = serv.findById(id);
        return cardapio.map(c -> ResponseEntity.ok(new CardapioResponse(c)))
                       .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST
    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody Cardapio cardapio) {
        // ... seu bloco de validação ResponseExceptionHandler ...

        try {
            String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Restaurante restaurante = restauranteServ.getByEmail(email);

            // O controller agora só precisa passar os dados para o service.
            // Note que agora passamos o restaurante como segundo argumento.
            Cardapio salvo = serv.save(cardapio, restaurante);

            return ResponseEntity.ok(new CardapioResponse(salvo));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("erro", "Ocorreu um erro inesperado."));
        }
    }
    
    // PUT
    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody Cardapio cardapio) throws SecurityException {
    	String x = "" + cardapio.getPreco();
        // A validação do corpo da requisição ainda é útil
        ResponseExceptionHandler handler = new ResponseExceptionHandler();
        if (cardapio.getNome() != null && cardapio.getNome().isBlank()) {
             handler.checkEmptyStrting("nome", cardapio.getNome());
        }
        if (!x.isBlank() && !x.isEmpty() && x != null && cardapio.getPreco() < 0) {
            handler.checkMinimmumNumber("valor", cardapio.getPreco(), 0.0);
        }
        if (handler.errors()) {
            return handler.generateResponse(HttpStatus.BAD_REQUEST);
        }

        try {
            String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Restaurante restaurante = restauranteServ.getByEmail(email);

            // Apenas uma chamada ao serviço, passando o ID do item, os novos dados e o dono.
            Cardapio salvo = serv.update(id, cardapio, restaurante);
            
            return ResponseEntity.ok(new CardapioResponse(salvo));

        } catch (RuntimeException e) { // Pega "não encontrado"
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage()));
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        serv.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}