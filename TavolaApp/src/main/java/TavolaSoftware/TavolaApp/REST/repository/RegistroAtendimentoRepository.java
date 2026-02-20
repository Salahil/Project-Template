package TavolaSoftware.TavolaApp.REST.repository;

import TavolaSoftware.TavolaApp.REST.model.RegistroAtendimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RegistroAtendimentoRepository extends JpaRepository<RegistroAtendimento, UUID> {

    /**
     * Busca todos os registros de atendimento de um restaurante específico.
     * Usa 'JOIN FETCH' para trazer os dados relacionados (pedidos, garçons) 
     * e evitar o problema N+1.
     */
    @Query("SELECT r FROM RegistroAtendimento r " +
           "LEFT JOIN FETCH r.pedidos " +
           "LEFT JOIN FETCH r.garcons " +
           "LEFT JOIN FETCH r.mesa " +
           "LEFT JOIN FETCH r.cliente " +
           "WHERE r.restaurante.id = :restauranteId " +
           "ORDER BY r.horaFim DESC")
    List<RegistroAtendimento> findByRestauranteIdFetch(UUID restauranteId);

    /**
     * Busca um registro de atendimento específico pelo ID,
     * garantindo que ele pertença ao restaurante.
     */
    @Query("SELECT r FROM RegistroAtendimento r " +
           "LEFT JOIN FETCH r.pedidos " +
           "LEFT JOIN FETCH r.garcons " +
           "LEFT JOIN FETCH r.mesa " +
           "LEFT JOIN FETCH r.cliente c " +
           "LEFT JOIN FETCH c.usuario " + // Opcional, se precisar do nome do cliente
           "WHERE r.id = :id AND r.restaurante.id = :restauranteId")
    Optional<RegistroAtendimento> findByIdAndRestauranteIdFetch(UUID id, UUID restauranteId);
}