package TavolaSoftware.TavolaApp.REST.repository;

import TavolaSoftware.TavolaApp.REST.model.AccessModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccessRepository extends JpaRepository<AccessModel, UUID> {
    Optional<AccessModel> findByEmail(String email);
    List<AccessModel> findByExpiracaoCodigoBefore(LocalDateTime now);
}