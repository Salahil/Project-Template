package com.enois.logapi.service;

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
    
    // - coisa do google
    
 // Puxa a chave do application.properties
    @Value("${google.client.id}")
    private String googleClientId;

    public LoginResponse loginComGoogle(GoogleLoginRequest request) {
        try {
            // 1. Prepara o verificador do Google com a nossa Chave (Client ID)
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            // 2. Valida o Token recebido do front-end
            GoogleIdToken idToken = verifier.verify(request.getToken());
            if (idToken == null) {
                throw new RuntimeException("Token do Google inválido ou expirado.");
            }

            // 3. Extrai as informações do Google
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String nome = (String) payload.get("name");

            // 4. Verifica se o utilizador já existe na nossa base de dados
            Optional<Usuario> usuarioOpt = repository.findByEmail(email);
            Usuario user;

            if (usuarioOpt.isPresent()) {
                // Utilizador já existe, apenas pegamos os dados dele
                user = usuarioOpt.get();
            } else {
                // Utilizador NOVO! Vamos criar uma conta para ele automaticamente
                user = new Usuario();
                user.setEmail(email);
                user.setNome(nome);
                
                // Como ele logou pelo Google, ele não tem senha na nossa API.
                // Geramos uma senha aleatória gigante só para o campo não ficar vazio.
                // Se um dia ele quiser logar com senha, ele usa a função "Esqueci a Senha".
                user.setSenha(passwordEncoder.encode(UUID.randomUUID().toString()));
                
                // Marcamos que o email é verificado, pois o Google já garantiu isso!
                user.setEmailVerificado(true); 

                // Salva uma flag indicando que a origem foi o Google nos atributos dinâmicos
                HashMap<String, Object> atributos = new HashMap<>();
                atributos.put("auth_provider", "google");
                user.setAtributos(atributos);

                user = repository.save(user); // Salva no banco de dados
            }

            String nossoTokenJwt = jwtUtil.generateAccessToken(user.getEmail());
            
            // 5.5 GERA O REFRESH TOKEN
            RefreshToken rtGoogle = refreshTokenService.criarRefreshToken(user);

            // 6. Retorna a resposta padronizada
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