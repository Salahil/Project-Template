package TavolaSoftware.TavolaApp.REST.repository;

import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
// A interface continua estendendo JpaSpecificationExecutor, isso é o mais importante
public interface RestauranteRepository extends JpaRepository<Restaurante, UUID>, JpaSpecificationExecutor<Restaurante> {

    // Estes métodos são úteis e podem ser mantidos
    Restaurante findByUsuarioEmail(String email);
    Optional<Restaurante> findByUsuario(Usuario usuario);
    List<Restaurante> findByUsuarioEnderecoCidadeIgnoreCase(String cidade);
    
}