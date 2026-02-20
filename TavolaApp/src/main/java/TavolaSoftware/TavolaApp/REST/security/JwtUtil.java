package TavolaSoftware.TavolaApp.REST.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException; // <<< NOVO IMPORT
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException; // <<< NOVO IMPORT
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException; // <<< NOVO IMPORT (Se não estiver como parte de JwtException geral)
import io.jsonwebtoken.UnsupportedJwtException; // <<< NOVO IMPORT
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    private static final long ACCESS_TOKEN_EXPIRATION = 24 * 60 * 60 * 1000; // 1 dia
    private static final long REFRESH_TOKEN_EXPIRATION = 30 * 24 * 60 * 60 * 1000; // 30 dias

    private final PrivateKey privateKey;
    private final PublicKey publicKey;

    public JwtUtil() throws Exception {
        this.privateKey = loadPrivateKeyFromResource("private_key.pem"); //
        this.publicKey = loadPublicKeyFromResource("public_key.pem"); //
    }
    
    public String generateFuncionarioToken(String emailRestaurante, UUID garcomId, UUID restauranteId) {
        return Jwts.builder()
                .setSubject(emailRestaurante) // Identifica a qual "empresa" o token pertence
                .claim("role", "FUNCIONARIO") // Claim para identificar o tipo de usuário
                .claim("garcomId", garcomId.toString())
                .claim("restauranteId", restauranteId.toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION)) // 1 dia de validade
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }

    public String generateAccessToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact(); //
    }

    public String generateRefreshToken(UUID id, String email) {
        return Jwts.builder()
                .setSubject(email)
                .claim("id", id.toString()) 
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact(); //
    }


    public Claims parseToken(String token) {
        System.out.println("[JwtUtil] Tentando validar/parsear token..."); // Log ajustado para clareza
        return Jwts.parserBuilder()
                .setSigningKey(publicKey)
                .build()
                .parseClaimsJws(token)
                .getBody(); //
    }

    // MÉTODO ATUALIZADO COM LOGS DETALHADOS
    public boolean isTokenValid(String token) {
        try {
            System.out.println("[JwtUtil] isTokenValid: Chamando parseToken...");
            parseToken(token);
            System.out.println("[JwtUtil] isTokenValid: Token parseado com sucesso, considerado válido.");
            return true;
        } catch (ExpiredJwtException e) {
            System.err.println("[JwtUtil] isTokenValid: Token expirado - " + e.getMessage());
            return false;
        } catch (SignatureException e) {
            System.err.println("[JwtUtil] isTokenValid: Assinatura do token inválida - " + e.getMessage());
            return false;
        } catch (MalformedJwtException e) {
            System.err.println("[JwtUtil] isTokenValid: Token malformado - " + e.getMessage());
            return false;
        } catch (UnsupportedJwtException e) { 
            System.err.println("[JwtUtil] isTokenValid: Token não suportado - " + e.getMessage());
            return false;
        } catch (IllegalArgumentException e) {
            // Esta exceção pode ser lançada por Jwts.parserBuilder() se o token for nulo/vazio antes mesmo de tentar parsear
            System.err.println("[JwtUtil] isTokenValid: Argumento ilegal (token nulo/vazio ou problema na chave?) - " + e.getMessage());
            return false;
        } catch (JwtException e) { // Pega outras exceções JWT não listadas acima
            System.err.println("[JwtUtil] isTokenValid: Exceção JWT genérica - " + e.getMessage());
            return false;
        }
    }

    private PrivateKey loadPrivateKeyFromResource(String filename) throws Exception {
        InputStream is = getClass().getClassLoader().getResourceAsStream(filename);
        if (is == null) throw new RuntimeException("Arquivo de chave privada não encontrado no classpath: " + filename);
        String key = new String(is.readAllBytes(), StandardCharsets.UTF_8);
        key = key.replace("-----BEGIN PRIVATE KEY-----", "")
                 .replace("-----END PRIVATE KEY-----", "")
                 .replaceAll("\\s", ""); //
        byte[] keyBytes = Base64.getDecoder().decode(key);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        return KeyFactory.getInstance("RSA").generatePrivate(spec); //
    }

    private PublicKey loadPublicKeyFromResource(String filename) throws Exception {
        InputStream is = getClass().getClassLoader().getResourceAsStream(filename);
        if (is == null) throw new RuntimeException("Arquivo de chave pública não encontrado no classpath: " + filename);
        String key = new String(is.readAllBytes(), StandardCharsets.UTF_8);
        key = key.replace("-----BEGIN PUBLIC KEY-----", "")
                 .replace("-----END PUBLIC KEY-----", "")
                 .replaceAll("\\s", ""); //
        byte[] keyBytes = Base64.getDecoder().decode(key);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        return KeyFactory.getInstance("RSA").generatePublic(spec); //
    }
}