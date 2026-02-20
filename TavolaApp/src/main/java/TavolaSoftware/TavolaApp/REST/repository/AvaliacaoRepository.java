package TavolaSoftware.TavolaApp.REST.repository;

import TavolaSoftware.TavolaApp.REST.model.Avaliacao;
import TavolaSoftware.TavolaApp.REST.model.Cliente;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, UUID> {
	
	/**
     * Busca todas as avaliações de um restaurante específico,
     * trazendo junto (JOIN FETCH) os dados do Cliente e do Usuario associado,
     * para evitar N+1 queries.
     * Ordena pelas mais recentes (assumindo que IDs maiores são mais recentes).
     */
    @Query("SELECT a FROM Avaliacao a JOIN FETCH a.cliente c JOIN FETCH c.usuario u WHERE a.restaurante.id = :restauranteId ORDER BY a.id DESC")
    List<Avaliacao> findDetalhadaByRestauranteId(@Param("restauranteId") UUID restauranteId);

    void deleteAllByClienteId(UUID clienteId); // Método já existente

    // Método para buscar todas as avaliações de um restaurante específico
    List<Avaliacao> findByRestauranteId(UUID restauranteId);

    // Método para encontrar uma avaliação específica por cliente e restaurante
    Optional<Avaliacao> findByClienteAndRestaurante(Cliente cliente, Restaurante restaurante);
    
    /**
     * Encontra todas as avaliações de um cliente específico.
     */
    List<Avaliacao> findByClienteId(UUID clienteId);

    /**
     * Encontra todas as avaliações de um cliente com nota maior ou igual a um valor.
     * Essencial para descobrirmos do que o cliente realmente gosta.
     */
    List<Avaliacao> findByClienteIdAndScoreGreaterThanEqual(UUID clienteId, int score);
}