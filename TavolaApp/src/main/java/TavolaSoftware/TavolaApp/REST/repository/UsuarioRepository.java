package TavolaSoftware.TavolaApp.REST.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import TavolaSoftware.TavolaApp.REST.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
	Optional<Usuario> findByEmail(String email); // <<< Altere o tipo de retorno aqui    
    Optional<Usuario> findByEmailAndEmailVerificado(String email, boolean verificado);
    
}
