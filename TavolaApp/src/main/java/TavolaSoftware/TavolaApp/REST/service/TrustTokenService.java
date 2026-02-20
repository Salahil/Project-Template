package TavolaSoftware.TavolaApp.REST.service;

import TavolaSoftware.TavolaApp.REST.model.TrustToken;
import TavolaSoftware.TavolaApp.REST.model.Usuario;
import TavolaSoftware.TavolaApp.REST.repository.TrustTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class TrustTokenService {

    @Autowired
    private TrustTokenRepository tokenRepository;

    private static final SecureRandom secureRandom = new SecureRandom();
    private static final Base64.Encoder base64Encoder = Base64.getUrlEncoder();

    // Gera um token seguro e aleatório para o cookie
    public String generateNewToken() {
    	System.out.println("[RememberMeToken] " + "Começando a gerar tokens de acesso");
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        
        System.out.println("[RememberMeToken] " + "token gerado");
        return base64Encoder.encodeToString(randomBytes);
    }

    // Cria e armazena o hash do token no banco
    @Transactional
    public void storeToken(String token, Usuario usuario) {
        String tokenHash = BCrypt.hashpw(token, BCrypt.gensalt());
        System.out.println("[RememberMeToken] " + "token criptografado como: " + tokenHash);
        TrustToken newToken = new TrustToken();
        newToken.setTokenHash(tokenHash);
        newToken.setUsuario(usuario);
        newToken.setExpiryDate(LocalDateTime.now().plusDays(30)); // Duração de 30 dias
        System.out.println("[RememberMeToken] " + "token criado e salvo no banco");
        tokenRepository.save(newToken);
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> validateTokenAndGetUser(String token) {
        if (token == null || token.isEmpty()) {
            return Optional.empty();
        }

        List<TrustToken> allTokens = tokenRepository.findAll(); //findAll() é necessário por causa do BCrypt
        System.out.println("[TrustTokenService] Validando token contra " + allTokens.size() + " tokens no banco.");

        for (TrustToken storedToken : allTokens) {
            if (BCrypt.checkpw(token, storedToken.getTokenHash())) {
                System.out.println("[TrustTokenService] Token correspondente encontrado para o usuário: " + storedToken.getUsuario().getId());
                if (storedToken.getExpiryDate().isAfter(LocalDateTime.now())) {
                    System.out.println("[TrustTokenService] Token é válido e não expirou.");
                    return Optional.of(storedToken.getUsuario());
                } else {
                    // Token expirado, remove do banco para limpeza
                    System.out.println("[TrustTokenService] Token encontrado, mas está expirado. Deletando.");
                    tokenRepository.delete(storedToken);
                    return Optional.empty();
                }
            }
        }
        System.out.println("[TrustTokenService] Nenhum token correspondente encontrado no banco.");
        return Optional.empty();
    }
    
    // Remove o token
    @Transactional
    public void clearToken(String token) {
    	System.out.println("[RememberMeToken] " + "processo de remoção de token iniciado");
        for (TrustToken storedToken : tokenRepository.findAll()) {
            if (BCrypt.checkpw(token, storedToken.getTokenHash())) {
            	System.out.println("[RememberMeToken] " + "token deletado");
                tokenRepository.delete(storedToken);
                break;
            }
        }
    }
}