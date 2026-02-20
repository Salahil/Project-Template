package TavolaSoftware.TavolaApp.REST.controller;

import TavolaSoftware.TavolaApp.REST.dto.requests.ServicoRequest;
import TavolaSoftware.TavolaApp.REST.dto.responses.ServicoResponse;
import TavolaSoftware.TavolaApp.REST.model.Servico;
import TavolaSoftware.TavolaApp.REST.service.ServicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth/servicos") // Ou "/admin/servicos" dependendo da sua configuração de segurança
public class ServicoController {

    @Autowired
    private ServicoService servicoService;

    /**
     * GET /auth/servicos
     * Retorna uma lista de todos os serviços disponíveis no sistema.
     * Endpoint público ou para usuários autenticados.
     */
    @GetMapping
    public ResponseEntity<Set<ServicoResponse>> listarTodosServicos() {
        Set<ServicoResponse> response = servicoService.findAll().stream()
                .map(ServicoResponse::new)
                .collect(Collectors.toSet());
        return ResponseEntity.ok(response);
    }

    /**
     * GET /auth/servicos/{id}
     * Busca um serviço específico pelo seu ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ServicoResponse> getServicoPorId(@PathVariable UUID id) {
        return servicoService.findById(id)
                .map(servico -> ResponseEntity.ok(new ServicoResponse(servico)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * PUT /auth/servicos/{id}
     * Atualiza um serviço existente.
     * RECOMENDAÇÃO: Este endpoint deve ser protegido para acesso apenas de administradores.
     */
    @PutMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')") // Exemplo de como proteger com Spring Security
    public ResponseEntity<?> atualizarServico(@PathVariable UUID id, @RequestBody ServicoRequest request) throws IllegalArgumentException {
        if (request.getNome() == null || request.getNome().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "O nome do serviço não pode ser vazio."));
        }

        try {
            Servico servicoAtualizado = servicoService.update(id, request.getNome(), request.getDescricao());
            return ResponseEntity.ok(new ServicoResponse(servicoAtualizado));
        } catch (RuntimeException e) {
            // Tratamento de erro para "serviço não encontrado"
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * DELETE /auth/servicos/{id}
     * Deleta um serviço do sistema.
     * RECOMENDAÇÃO: Este endpoint deve ser protegido para acesso apenas de administradores.
     */
    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')") // Exemplo de como proteger com Spring Security
    public ResponseEntity<Void> deletarServico(@PathVariable UUID id) {
        try {
            servicoService.delete(id);
            return ResponseEntity.noContent().build(); // HTTP 204: Sucesso, sem conteúdo para retornar
        } catch (RuntimeException e) {
            // Ocorre se o serviço com o ID fornecido não for encontrado
            return ResponseEntity.notFound().build(); // HTTP 404
        }
    }
}