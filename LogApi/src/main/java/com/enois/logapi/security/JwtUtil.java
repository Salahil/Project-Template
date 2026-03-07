package com.enois.logapi.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
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
import java.util.function.Function;

@Component
public class JwtUtil {

    private final PrivateKey privateKey;
    private final PublicKey publicKey;

    // Expiração de 24 horas
    private static final long JWT_TOKEN_VALIDITY = 24 * 60 * 60 * 1000;

    public JwtUtil() throws Exception {
        this.privateKey = loadPrivateKeyFromResource("private_key.pem");
        this.publicKey = loadPublicKeyFromResource("public_key.pem");
    }

    // --- GERAÇÃO DO TOKEN ---
    public String generateAccessToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY))
                .signWith(privateKey, SignatureAlgorithm.RS256) // Usando RSA 256
                .compact();
    }

    // --- VALIDAÇÃO ---
    public boolean isTokenValid(String token, String email) {
        final String username = extractUsername(token);
        return (username.equals(email) && !isTokenExpired(token));
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(publicKey) // Valida com a chave PÚBLICA
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // --- MÉTODOS AUXILIARES PARA LER OS ARQUIVOS .PEM ---
    private PrivateKey loadPrivateKeyFromResource(String filename) throws Exception {
        InputStream is = getClass().getClassLoader().getResourceAsStream(filename);
        if (is == null) throw new RuntimeException("Chave privada não encontrada!");
        String key = new String(is.readAllBytes(), StandardCharsets.UTF_8)
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", "");
        byte[] keyBytes = Base64.getDecoder().decode(key);
        return KeyFactory.getInstance("RSA").generatePrivate(new PKCS8EncodedKeySpec(keyBytes));
    }

    private PublicKey loadPublicKeyFromResource(String filename) throws Exception {
        InputStream is = getClass().getClassLoader().getResourceAsStream(filename);
        if (is == null) throw new RuntimeException("Chave pública não encontrada!");
        String key = new String(is.readAllBytes(), StandardCharsets.UTF_8)
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s", "");
        byte[] keyBytes = Base64.getDecoder().decode(key);
        return KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(keyBytes));
    }
}