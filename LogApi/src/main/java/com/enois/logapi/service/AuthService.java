package com.enois.logapi.service;

import java.time.Instant;
import java.util.Collections;
import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.enois.logapi.dto.GoogleLoginRequest;
import com.enois.logapi.dto.LoginRequest;
import com.enois.logapi.dto.LoginResponse;
import com.enois.logapi.dto.RegisterRequest;
import com.enois.logapi.model.RefreshToken;
import com.enois.logapi.model.Usuario;
import com.enois.logapi.repository.UsuarioRepository;
import com.enois.logapi.security.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@Service
public class AuthService {
	
	@Autowired
	private RecaptchaService recaptchaService;

    @Autowired
    private UsuarioRepository repository;
    
    @Autowired
    private PasswordEncoder passwordEncoder; 
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthenticationManager authenticationManager; 
    
    @Autowired
    private RefreshTokenService refreshTokenService;
    
    @Autowired
    private EmailService emailService;

    public Usuario registrar(RegisterRequest request, String recaptchaToken) {
    
    	if (!recaptchaService.isValido(recaptchaToken)) {
            throw new RuntimeException("Falha na validação do reCAPTCHA. Você é um robô?");
        }
    	
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado!");
        }

        Usuario user = new Usuario();
        user.setNome(request.getNome());
        user.setEmail(request.getEmail());
        user.setTelefone(request.getTelefone());
        user.setAtributos(request.getDadosExtras()); // Salva o JSON dinâmico
        
        user.setSenha(passwordEncoder.encode(request.getSenha()));
        
        return repository.save(user);
    }
    
    public void solicitarRecuperacaoSenha(String email) {
        Usuario user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Se o e-mail existir no nosso sistema, um link será enviado.")); // Mensagem vaga por segurança
        String token = UUID.randomUUID().toString();
        
        user.setResetToken(token);
        user.setResetTokenExpiry(Instant.now().plusSeconds(15 * 60));

        repository.save(user);
        emailService.enviarEmailRecuperacaoSenha(user.getEmail(), user.getNome(), token);
    }
    
    public void redefinirSenha(String token, String novaSenha) {
        Usuario user = repository.findAll().stream()
                .filter(u -> token.equals(u.getResetToken()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Token inválido ou não encontrado."));
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(Instant.now())) {
            throw new RuntimeException("Este link de recuperação já expirou. Pede um novo.");
        }
        user.setSenha(passwordEncoder.encode(novaSenha));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        
        repository.save(user);
    }

    public LoginResponse login(LoginRequest request, String recaptchaToken) {
    	if (!recaptchaService.isValido(recaptchaToken)) {
            throw new RuntimeException("Falha na validação do reCAPTCHA.");
        }
    	authenticationManager.authenticate(
    	        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha())
    	);
    	Usuario user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        String token = jwtUtil.generateAccessToken(user.getEmail());
        
        // GERA O REFRESH TOKEN AQUI!
        RefreshToken refreshToken = refreshTokenService.criarRefreshToken(user);

        return new LoginResponse(
            token,
            refreshToken.getToken(), // Passa o Refresh Token
            user.getId(),
            user.getNome(),
            user.getEmail(),
            user.getAtributos()
        );
    }
    
    @Value("${google.client.id}")
    private String googleClientId;

    public LoginResponse loginComGoogle(GoogleLoginRequest request) {
    	if (request.getToken() == null || request.getToken().isEmpty()) {
            throw new RuntimeException("Token do Google não enviado pelo front-end.");
        }
        try {
        	GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();
	
	        GoogleIdToken idToken = verifier.verify(request.getToken());
	        if (idToken == null) {
	            throw new RuntimeException("Token do Google inválido ou expirado.");
	        }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String nome = (String) payload.get("name");

            Optional<Usuario> usuarioOpt = repository.findByEmail(email);
            Usuario user;

            if (usuarioOpt.isPresent()) {
                user = usuarioOpt.get();
            } else {
                user = new Usuario();
                user.setEmail(email);
                user.setNome(nome);
                user.setSenha(passwordEncoder.encode(UUID.randomUUID().toString()));
                user.setEmailVerificado(true); 

                HashMap<String, Object> atributos = new HashMap<>();
                atributos.put("auth_provider", "google");
                user.setAtributos(atributos);

                user = repository.save(user); // Salva no banco de dados
            }

            String nossoTokenJwt = jwtUtil.generateAccessToken(user.getEmail());
            
            RefreshToken rtGoogle = refreshTokenService.criarRefreshToken(user);

            return new LoginResponse(
                    nossoTokenJwt,
                    rtGoogle.getToken(), // Passa o Refresh Token
                    user.getId(),
                    user.getNome(),
                    user.getEmail(),
                    user.getAtributos()
            );

        } catch (Exception e) {
            throw new RuntimeException("Falha ao autenticar com o Google: " + e.getMessage());
        }
    }
}