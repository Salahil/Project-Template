package TavolaSoftware.TavolaApp.REST.repository;

import TavolaSoftware.TavolaApp.REST.model.Ambiente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AmbienteRepository extends JpaRepository<Ambiente, UUID> {
    // Encontra todos os ambientes de um restaurante específico
    List<Ambiente> findByRestauranteId(UUID restauranteId);
}