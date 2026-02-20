package TavolaSoftware.TavolaApp.REST.controller;

import TavolaSoftware.TavolaApp.REST.dto.requests.UsuarioUpdateRequest;
import TavolaSoftware.TavolaApp.REST.dto.responses.UsuarioResponse;
import TavolaSoftware.TavolaApp.REST.model.Usuario;
import TavolaSoftware.TavolaApp.REST.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;
    
    /**
     * GET /auth/usuarios/self
     * Endpoint para o usuário logado obter seus próprios dados.
     */
    @GetMapping("/self")
    public ResponseEntity<UsuarioResponse> getSelf() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Usuario usuario = usuarioService.getUsuarioByEmail(email);
        return ResponseEntity.ok(new UsuarioResponse(usuario));
    }

    /**
     * PUT /auth/usuarios/self/update
     * Endpoint para o usuário logado atualizar seu próprio perfil.
     */
    @PutMapping("/self/update")
    public ResponseEntity<?> updateSelf(@RequestBody UsuarioUpdateRequest request) {
        try {
            String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Usuario usuarioAtualizado = usuarioService.updateUserProfile(email, request);
            return ResponseEntity.ok(new UsuarioResponse(usuarioAtualizado));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("erro", "Falha ao processar a imagem."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", e.getMessage()));
        }
    }

    // --- ENDPOINTS ADMINISTRATIVOS ---
    // RECOMENDAÇÃO: Proteja estes endpoints para acesso apenas de administradores.

    /**
     * GET /auth/usuarios
     * Lista todos os usuários do sistema. (Admin)
     */
    @GetMapping
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioResponse>> getAllUsers() {
        List<UsuarioResponse> usuarios = usuarioService.findAllUsers().stream()
                .map(UsuarioResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(usuarios);
    }

    /**
     * GET /auth/usuarios/{id}
     * Busca um usuário específico por ID. (Admin)
     */
    @GetMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResponse> getUserById(@PathVariable UUID id) {
        return usuarioService.findUserById(id)
                .map(usuario -> ResponseEntity.ok(new UsuarioResponse(usuario)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /auth/usuarios/{id}
     * Deleta um usuário específico por ID. (Admin)
     */
    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUserById(@PathVariable UUID id) {
        try {
            usuarioService.deleteUserById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}