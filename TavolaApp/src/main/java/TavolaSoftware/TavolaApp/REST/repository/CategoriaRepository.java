package TavolaSoftware.TavolaApp.REST.repository;

import TavolaSoftware.TavolaApp.REST.model.Categoria;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CategoriaRepository extends JpaRepository<Categoria, UUID> {

    List<Categoria> findByRestauranteId(UUID restauranteId);

    Optional<Categoria> findByNomeAndRestauranteId(String nome, UUID restauranteId);
    
 // NOVO MÉTODO: Encontra categorias que não estão em uso por nenhum Cardapio
    @Query("SELECT c FROM Categoria c WHERE c.id NOT IN (SELECT DISTINCT i.categoria.id FROM Cardapio i WHERE i.categoria IS NOT NULL)")
    List<Categoria> findCategoriasSemCardapio();
}
