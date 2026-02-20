package TavolaSoftware.TavolaApp.REST.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import TavolaSoftware.TavolaApp.REST.model.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, UUID> {
	Cliente findByUsuarioEmail(String email);

}
