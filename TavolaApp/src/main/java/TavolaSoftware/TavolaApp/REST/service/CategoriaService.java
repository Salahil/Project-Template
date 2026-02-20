package TavolaSoftware.TavolaApp.REST.service;

import TavolaSoftware.TavolaApp.REST.model.Categoria;
import TavolaSoftware.TavolaApp.REST.repository.CategoriaRepository;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository repo;

    public List<Categoria> findAll() {
        return repo.findAll();
    }

    public Optional<Categoria> findById(UUID id) {
        return repo.findById(id);
    }

    public List<Categoria> findByRestauranteId(UUID restauranteId) {
        return repo.findByRestauranteId(restauranteId);
    }

    public Optional<Categoria> findByNomeAndRestauranteId(String nome, UUID restauranteId) {
        return repo.findByNomeAndRestauranteId(nome, restauranteId);
    }

    public Categoria save(Categoria categoria) {
        if (categoria.getNome() == null || categoria.getNome().isBlank() || categoria.getRestaurante() == null) {
            throw new IllegalArgumentException("O nome e o restaurante são obrigatórios para salvar uma categoria.");
        }

        Optional<Categoria> categoriaExistente = repo.findByNomeAndRestauranteId(
            categoria.getNome(), 
            categoria.getRestaurante().getId()
        );

        if (categoriaExistente.isPresent()) {
            return categoriaExistente.get();
        }

        return repo.save(categoria);
    }

    public Categoria update(UUID id, Categoria categoria) {
        if (repo.existsById(id)) {
            categoria.setId(id);
            return repo.save(categoria);
        }
        return null;
    }

    public void deleteById(UUID id) {
        repo.deleteById(id);
    }

    // NOVO: método especial para tratar String
    public Categoria saveIfNotExists(String nomeCategoria, Restaurante restaurante) {
        Optional<Categoria> categoriaExistente = repo.findByNomeAndRestauranteId(nomeCategoria, restaurante.getUsuario().getId());

        if (categoriaExistente.isPresent()) {
            return categoriaExistente.get();
        }

        Categoria novaCategoria = new Categoria();
        novaCategoria.setNome(nomeCategoria);
        novaCategoria.setRestaurante(restaurante);
        return repo.save(novaCategoria);
    }
}
