package TavolaSoftware.TavolaApp.REST.repository;

import TavolaSoftware.TavolaApp.REST.model.Mesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <<< IMPORTAR
import org.springframework.data.repository.query.Param; // <<< IMPORTAR
import org.springframework.stereotype.Repository;

import java.time.LocalDate; // <<< IMPORTAR
import java.time.LocalTime; // <<< IMPORTAR
import java.util.List;
import java.util.UUID;

@Repository
public interface MesaRepository extends JpaRepository<Mesa, UUID> {
    
    List<Mesa> findByAmbienteId(UUID ambienteId); //
    
    List<Mesa> findByAmbienteIdIn(List<UUID> ambienteIds); //
    
    
    // <<< MÉTODO NOVO (ESSENCIAL PARA O MOCKDATA) >>>
    /**
     * Encontra mesas que pertencem a um restaurante, têm capacidade suficiente,
     * E NÃO TÊM uma reserva confirmada (ATIVA ou CONFIRMADA) para a data e hora exatas.
     * Esta é a query que o 'findRandomMesa' do MockDataService usa.
     */
    @Query("SELECT m FROM Mesa m JOIN m.ambiente a " +
           "WHERE a.restaurante.id = :restauranteId " +
           "AND m.capacidade >= :capacidade " +
           "AND NOT EXISTS (" +
           "  SELECT r FROM Reserva r JOIN r.mesas rm " +
           "  WHERE rm.id = m.id " +
           "  AND r.dataReserva = :data " +
           "  AND r.horaReserva = :hora " +
           "  AND r.status IN (TavolaSoftware.TavolaApp.tools.StatusReserva.ATIVA, TavolaSoftware.TavolaApp.tools.StatusReserva.CONFIRMADA)" +
           ")")
    List<Mesa> findMesasDisponiveis(
            @Param("restauranteId") UUID restauranteId, 
            @Param("data") LocalDate data, 
            @Param("hora") LocalTime hora, 
            @Param("capacidade") int capacidade
    );
}