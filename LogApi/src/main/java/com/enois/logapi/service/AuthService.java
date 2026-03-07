package com.enois.logapi.service;

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
}