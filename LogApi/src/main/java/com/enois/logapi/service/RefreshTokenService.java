package com.enois.logapi.service;

import com.enois.logapi.model.RefreshToken;
import com.enois.logapi.model.Usuario;
import com.enois.logapi.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    // Tempo de validade do token: 7 dias em milissegundos
    private final Long refreshTokenDurationMs = 604800000L;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    // 1. Criar um novo Refresh Token recebendo a entidade Usuario já carregada
    public RefreshToken criarRefreshToken(Usuario usuario) {
        RefreshToken refreshToken = new RefreshToken();
        
        // O Lombok (@Data) encarrega-se de fazer estes métodos existirem nos bastidores
        refreshToken.setUsuario(usuario);
        refreshToken.setToken(UUID.randomUUID().toString()); 
        refreshToken.setDataExpiracao(Instant.now().plusMillis(refreshTokenDurationMs));

        return refreshTokenRepository.save(refreshToken);
    }

    // 2. Buscar um token na base de dados
    public Optional<RefreshToken> buscarPorToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    // 3. Verificar se o token já expirou
    public RefreshToken verificarExpiracao(RefreshToken token) {
        // Compara a data de expiração (Instant) do model com o momento atual (Instant.now())
        if (token.getDataExpiracao().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token); // Limpa da base de dados se estiver caducado
            throw new RuntimeException("O Refresh Token expirou. Por favor, faça login novamente.");
        }
        return token;
    }

    // 4. Apagar o token usando a própria entidade (útil para o logout)
    @Transactional
    public void apagarPorUsuario(Usuario usuario) {
        refreshTokenRepository.deleteByUsuario(usuario);
    }
}