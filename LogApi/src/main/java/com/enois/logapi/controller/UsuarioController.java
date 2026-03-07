package com.enois.logapi.controller;

import com.enois.logapi.dto.ApiResponse;
import com.enois.logapi.dto.UsuarioResponse;
import com.enois.logapi.dto.UsuarioUpdateRequest;
import com.enois.logapi.model.Usuario;
import com.enois.logapi.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    // GET: Buscar todos
    @GetMapping
    public ResponseEntity<ApiResponse<List<UsuarioResponse>>> listarTodos() {
        // Busca a lista de entidades e converte cada uma num UsuarioResponse (DTO)
        List<UsuarioResponse> listaDto = service.buscarTodos().stream()
                .map(UsuarioResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new ApiResponse<>(listaDto, "Utilizadores listados com sucesso."));
    }

    // GET: Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UsuarioResponse>> buscarPorId(@PathVariable UUID id) {
        try {
            Usuario usuario = service.buscarPorId(id);
            UsuarioResponse dto = new UsuarioResponse(usuario);
            return ResponseEntity.ok(new ApiResponse<>(dto, "Utilizador encontrado."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, e.getMessage()));
        }
    }

    // PUT: Atualizar dados
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UsuarioResponse>> atualizar(
            @PathVariable UUID id, 
            @RequestBody UsuarioUpdateRequest request) {
        try {
            // Repassamos o DTO para o Service
            Usuario usuarioAtualizado = service.atualizar(id, request.getNome(), request.getTelefone(), request.getDadosExtras());
            UsuarioResponse dto = new UsuarioResponse(usuarioAtualizado);
            
            return ResponseEntity.ok(new ApiResponse<>(dto, "Utilizador atualizado com sucesso."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage()));
        }
    }

    // DELETE: Apagar utilizador
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletar(@PathVariable UUID id) {
        try {
            service.deletar(id);
            return ResponseEntity.ok(new ApiResponse<>(null, "Utilizador apagado com sucesso."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage()));
        }
    }
}