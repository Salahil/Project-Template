package com.enois.logapi.repository;

import com.enois.logapi.model.RefreshToken;
import com.enois.logapi.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    
    Optional<RefreshToken> findByToken(String token);
    
    void deleteByUsuario(Usuario usuario);
}