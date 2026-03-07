package com.enois.logapi.service;

import com.enois.logapi.model.Usuario;
import com.enois.logapi.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    // READ: Buscar todos
    public List<Usuario> buscarTodos() {
        return repository.findAll();
    }

    // READ: Buscar por ID
    public Usuario buscarPorId(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado com o ID: " + id));
    }

    // UPDATE: Atualizar dados (sem mexer na senha ou email)
    public Usuario atualizar(UUID id, String nome, String telefone, Map<String, Object> novosAtributos) {
        Usuario usuarioExistente = buscarPorId(id);

        if (nome != null) usuarioExistente.setNome(nome);
        if (telefone != null) usuarioExistente.setTelefone(telefone);
        
        // Se enviarem novos atributos JSON, atualizamos
        if (novosAtributos != null) {
            usuarioExistente.setAtributos(novosAtributos);
        }

        return repository.save(usuarioExistente);
    }

    // DELETE: Apagar utilizador
    public void deletar(UUID id) {
        Usuario usuario = buscarPorId(id);
        repository.delete(usuario);
    }
}