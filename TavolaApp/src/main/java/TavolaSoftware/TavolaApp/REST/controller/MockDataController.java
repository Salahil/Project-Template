package TavolaSoftware.TavolaApp.REST.controller;

import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List; 
import java.util.Map; 
import java.util.UUID; 
import java.util.ArrayList; // <<< NOVO IMPORT
import java.util.stream.Collectors; // <<< NOVO IMPORT

import TavolaSoftware.TavolaApp.REST.service.MockDataService;
import TavolaSoftware.TavolaApp.REST.model.Cliente;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;


@RestController
@RequestMapping("/auth/uploads")
public class MockDataController {
	
    @Autowired
    private MockDataService mockDataService;
	
	/**
	 * Endpoint de teste (existente)
	 */
	@PostMapping("/teste-base64")
	public ResponseEntity<String> testarImagemBase64(@RequestParam("imagem") MultipartFile imagem) {
	    try {
	        if (imagem.isEmpty()) {
	            return ResponseEntity.badRequest().body("Arquivo de imagem está vazio.");
	        }
	        byte[] bytes = imagem.getBytes();
	        String imagemBase64 = Base64.getEncoder().encodeToString(bytes);

	        return ResponseEntity.ok(imagemBase64);
	    } catch (IOException e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("Erro ao processar a imagem: " + e.getMessage());
	    }
	}

    /**
     * [POST] /auth/uploads/mock/restaurante
     * Cria UM restaurante mock completo.
     */
    @PostMapping("/mock/restaurante")
    public ResponseEntity<?> criarRestauranteMock() {
        try {
            Restaurante r = mockDataService.createMockRestaurante();
            return ResponseEntity.ok(Map.of(
                "mensagem", "Restaurante mock criado com sucesso!",
                "id", r.getId(),
                "nome", r.getNome(),
                "email", r.getEmail()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("erro", "Falha ao criar restaurante mock: " + e.getMessage()));
        }
    }

    /**
     * [POST] /auth/uploads/mock/restaurante/massivo
     * NOVO: Cria 200 restaurantes mocks e retorna apenas a lista de IDs.
     */
    @PostMapping("/mock/restaurante/massivo")
    public ResponseEntity<?> criarRestauranteMockMassivo(@RequestParam(defaultValue = "200") int quantidade) {
        List<UUID> idsRestaurantes = new ArrayList<>();
        try {
            for (int i = 0; i < quantidade; i++) {
                Restaurante r = mockDataService.createMockRestaurante();
                idsRestaurantes.add(r.getId());
            }
            return ResponseEntity.ok(Map.of(
                "mensagem", String.format("%d Restaurantes mocks criados com sucesso!", quantidade),
                "idsRestaurantes", idsRestaurantes, // Retorna apenas a lista de IDs
                "quantidade", quantidade
            ));
        } catch (Exception e) {
            e.printStackTrace();
            // Retorna o que conseguiu criar, mesmo que falhe
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "erro", "Falha ao criar todos os restaurantes mocks: " + e.getMessage(),
                "idsRestaurantesCriados", idsRestaurantes,
                "quantidadeCriada", idsRestaurantes.size()
            ));
        }
    }

    /**
     * [POST] /auth/uploads/mock/cliente
     * Cria UM cliente mock e gera reservas.
     */
    @PostMapping("/mock/cliente")
    public ResponseEntity<?> criarClienteMock(@RequestBody List<UUID> idsRestaurantes) {
        if (idsRestaurantes == null || idsRestaurantes.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "É necessário fornecer uma lista de IDs de restaurantes no payload."));
        }
        
        try {
            Cliente c = mockDataService.createMockCliente(idsRestaurantes);
            return ResponseEntity.ok(Map.of(
                "mensagem", "Cliente mock e suas reservas foram criados com sucesso!",
                "id", c.getId(),
                "nome", c.getUsuario().getNome(),
                "email", c.getUsuario().getEmail()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("erro", "Falha ao criar cliente mock: " + e.getMessage()));
        }
    }
    
    /**
     * [POST] /auth/uploads/mock/cliente/massivo
     * NOVO: Cria 200 clientes mocks e gera reservas neles.
     */
    @PostMapping("/mock/cliente/massivo")
    public ResponseEntity<?> criarClienteMockMassivo(@RequestBody List<UUID> idsRestaurantes, @RequestParam(defaultValue = "200") int quantidade) {
        if (idsRestaurantes == null || idsRestaurantes.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "É necessário fornecer uma lista de IDs de restaurantes no payload para criar as reservas."));
        }
        
        List<UUID> idsClientes = new ArrayList<>();
        try {
            for (int i = 0; i < quantidade; i++) {
                Cliente c = mockDataService.createMockCliente(idsRestaurantes);
                idsClientes.add(c.getId());
            }
            return ResponseEntity.ok(Map.of(
                "mensagem", String.format("%d Clientes mocks criados com sucesso!", quantidade),
                "idsClientes", idsClientes,
                "quantidade", quantidade
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "erro", "Falha ao criar todos os clientes mocks: " + e.getMessage(),
                "idsClientesCriados", idsClientes,
                "quantidadeCriada", idsClientes.size()
            ));
        }
    }
}