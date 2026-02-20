package TavolaSoftware.TavolaApp.REST.repository;

import TavolaSoftware.TavolaApp.REST.model.Servico; // Importar Servico
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ServicoRepository extends JpaRepository<Servico, UUID> {

    Optional<Servico> findByNome(String nome); // Renomeado de findByTag para findByNome

    boolean existsByNome(String nome); // Renomeado de existsByTag para existsByNome
    
    @Query("SELECT s FROM Servico s WHERE s.restaurantes IS EMPTY")
    List<Servico> findServicosOrfos();
}