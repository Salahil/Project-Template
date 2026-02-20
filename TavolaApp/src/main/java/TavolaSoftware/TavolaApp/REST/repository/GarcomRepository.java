// Substitua o conteúdo de repository/GarcomRepository.java
package TavolaSoftware.TavolaApp.REST.repository;

import TavolaSoftware.TavolaApp.REST.model.Garcom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GarcomRepository extends JpaRepository<Garcom, UUID> {

    // Busca todos os garçons de um restaurante específico
    List<Garcom> findAllByRestauranteId(UUID restauranteId);

    // Usado para o login: busca um garçom pelo código DENTRO de um restaurante
    Optional<Garcom> findByRestauranteIdAndCodigoIdentidade(UUID restauranteId, String codigoIdentidade);
}