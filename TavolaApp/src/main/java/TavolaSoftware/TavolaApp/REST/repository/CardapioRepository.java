package TavolaSoftware.TavolaApp.REST.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import TavolaSoftware.TavolaApp.REST.model.Cardapio;

@Repository
public interface CardapioRepository extends JpaRepository<Cardapio, UUID> {
    List<Cardapio> findByRestauranteId(UUID restauranteId);
    Optional<Cardapio> findByNomeAndRestauranteId(String nome, UUID restauranteId);
    
    @Query("SELECT c FROM Cardapio c WHERE c.restaurante.id = :restauranteId AND c.disponivel = true")
    List<Cardapio> findAllDisponiveisByRestaurante(@Param("restauranteId") UUID restauranteId);
}
