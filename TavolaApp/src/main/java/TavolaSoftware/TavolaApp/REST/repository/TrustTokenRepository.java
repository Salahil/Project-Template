package TavolaSoftware.TavolaApp.REST.repository;

import TavolaSoftware.TavolaApp.REST.model.TrustToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrustTokenRepository extends JpaRepository<TrustToken, UUID> {
    Optional<TrustToken> findByTokenHash(String tokenHash);
    void deleteByTokenHash(String tokenHash);
}