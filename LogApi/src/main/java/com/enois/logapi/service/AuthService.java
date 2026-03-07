package com.enois.logapi.service;

import com.enois.logapi.dto.GoogleLoginRequest;
import com.enois.logapi.dto.LoginRequest;
import com.enois.logapi.dto.LoginResponse;
import com.enois.logapi.dto.RegisterRequest;
import com.enois.logapi.model.Usuario;
import com.enois.logapi.repository.UsuarioRepository;
import com.enois.logapi.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import java.util.Collections;
import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository repository;
    
    @Autowired
    private PasswordEncoder passwordEncoder; // Já configuramos no SecurityConfig
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthenticationManager authenticationManager; // Já configuramos no SecurityConfig

    public Usuario registrar(RegisterRequest request) {
        // 1. Validação simples
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado!");
        }

        // 2. Criação do Usuário
        Usuario user = new Usuario();
        user.setNome(request.getNome());
        user.setEmail(request.getEmail());
        user.setTelefone(request.getTelefone());
        user.setAtributos(request.getDadosExtras()); // Salva o JSON dinâmico
        
        // 3. Criptografia da Senha
        user.setSenha(passwordEncoder.encode(request.getSenha()));
        
        return repository.save(user);
    }

    public LoginResponse login(LoginRequest request) {
        // 1. Autenticação (O Spring Security verifica a senha e o hash para nós)
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha())
        );

        // 2. Se não deu erro acima, busca o usuário
        Usuario user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // 3. Gera o Token
        String token = jwtUtil.generateAccessToken(user.getEmail());

        // 4. Retorna tudo
        return new LoginResponse(
            token,
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

            // 5. Gera o NOSSO token JWT da API
            String nossoTokenJwt = jwtUtil.generateAccessToken(user.getEmail());

            // 6. Retorna a resposta padronizada para o Sérgio
            return new LoginResponse(
                    nossoTokenJwt,
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