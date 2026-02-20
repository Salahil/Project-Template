package TavolaSoftware.TavolaApp.REST.controller;

import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import TavolaSoftware.TavolaApp.REST.dto.requests.GarcomLoginRequest;
import TavolaSoftware.TavolaApp.REST.dto.requests.LoginRequest;
import TavolaSoftware.TavolaApp.REST.dto.requests.ReenvioRequest;
import TavolaSoftware.TavolaApp.REST.dto.requests.RegistroRequest;
import TavolaSoftware.TavolaApp.REST.dto.requests.SenhaResetConfirmRequest;
import TavolaSoftware.TavolaApp.REST.dto.requests.SenhaResetRequest;
import TavolaSoftware.TavolaApp.REST.dto.requests.VerificacaoRequest;
import TavolaSoftware.TavolaApp.REST.dto.responses.LoginResponse;
import TavolaSoftware.TavolaApp.REST.model.AccessModel;
import TavolaSoftware.TavolaApp.REST.model.Cliente;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.model.Servico;
import TavolaSoftware.TavolaApp.REST.model.Usuario;
import TavolaSoftware.TavolaApp.REST.repository.AccessRepository;
import TavolaSoftware.TavolaApp.REST.repository.ClienteRepository;
import TavolaSoftware.TavolaApp.REST.repository.RestauranteRepository;
import TavolaSoftware.TavolaApp.REST.repository.ServicoRepository;
import TavolaSoftware.TavolaApp.REST.repository.UsuarioRepository;
import TavolaSoftware.TavolaApp.REST.security.JwtUtil;
import TavolaSoftware.TavolaApp.REST.service.AccessService;
import TavolaSoftware.TavolaApp.REST.service.TrustTokenService;
import TavolaSoftware.TavolaApp.tools.TipoUsuario;
import TavolaSoftware.TavolaApp.tools.UploadUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/auth")
public class AccessController {

    @Autowired private AccessRepository accessRepository;
    @Autowired private UsuarioRepository repo;
    @Autowired private ClienteRepository repoClient;
    @Autowired private RestauranteRepository repoRestaurante;
    @Autowired private JwtUtil jwt;
    @Autowired private AccessService accessService;
    @Autowired private ServicoRepository repoServico;
    @Autowired private TrustTokenService rememberMeService;
    @Autowired private UploadUtils uplUtil; // <<< INJETAR O UPLOADUTILS

    // Constantes e ferramentas para o gerenciamento do cookie de confiança
    private static final String TRUST_COOKIE_NAME = "tavolaTrusts";
    private final ObjectMapper objectMapper = new ObjectMapper();


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistroRequest request) {
        if (repo.findByEmailAndEmailVerificado(request.getEmail(), true).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("erro", "O e-mail informado já está em uso."));
        }
        AccessModel pending = accessRepository.findByEmail(request.getEmail()).orElse(new AccessModel());
        pending.setNome(request.getNome());
        pending.setEmail(request.getEmail());
        pending.setSenhaCriptografada(BCrypt.hashpw(request.getSenha(), BCrypt.gensalt()));
        pending.setTipo(request.getTipo());
        pending.setCodigoVerificacao(accessService.gerarCodigoDeVerificacao());
        pending.setExpiracaoCodigo(LocalDateTime.now().plusMinutes(60));
        pending.setUsuarioId(null);

        try {
            pending.setPayload(objectMapper.writeValueAsString(request));
        } catch (JsonProcessingException e) {
            return ResponseEntity.internalServerError().body(Map.of("erro", "Falha ao processar dados de registro."));
        }
        
        accessRepository.save(pending);
        String urlDeVerificacao = "http://localhost:4200/confirmar-codigo/" + pending.getId();
        accessService.enviarEmailVerificacao(pending.getEmail(), pending.getNome(), pending.getCodigoVerificacao(), urlDeVerificacao);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "mensagem", "Registro iniciado! Um código de verificação foi enviado para seu e-mail.",
            "idVerificacao", pending.getId()
        ));
    }
    
    @PostMapping("/login/garcom")
    public ResponseEntity<?> loginGarcom(@RequestBody GarcomLoginRequest request) {
        try {
            // Apenas chama o serviço, que agora contém toda a lógica
            LoginResponse response = accessService.loginGarcom(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Captura os erros (ex: "Credenciais inválidas") do serviço
            // e retorna uma resposta de "Não Autorizado" (401)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("erro", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> iniciarLogin(@RequestBody LoginRequest loginRequest, HttpServletRequest request, HttpServletResponse httpResponse) { // <<< Adicionado httpResponse        
    	Optional<Usuario> usuarioOpt = repo.findByEmail(loginRequest.getEmail());

        if (usuarioOpt.isEmpty() || !BCrypt.checkpw(loginRequest.getSenha(), usuarioOpt.get().getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("erro", "Credenciais inválidas."));
        }

        Usuario usuario = usuarioOpt.get();
        
        if (usuario.getEmail().endsWith("@tavola.com")) {
            System.out.println("[Login] Usuário MOCK detectado (" + usuario.getEmail() + "). Pulando 2FA.");
            
            String novoTrustToken = null;
            if (loginRequest.isMantenhaMeConectado()) {
                novoTrustToken = rememberMeService.generateNewToken();
                rememberMeService.storeToken(novoTrustToken, usuario);
            }
            // Chama o gerador de resposta diretamente, passando o httpResponse
            return gerarRespostaComTokens(usuario, novoTrustToken, request, httpResponse);
        }

        // Verificação de Confiança com o cookie composto
        String userSpecificToken = getTokenFromTrustCookie(request, usuario.getId());

        if (userSpecificToken != null) {
            Optional<Usuario> usuarioDoTokenOpt = rememberMeService.validateTokenAndGetUser(userSpecificToken);

            if (usuarioDoTokenOpt.isPresent() && usuarioDoTokenOpt.get().getId().equals(usuario.getId())) {
                System.out.println("[Login] Dispositivo confiável para " + usuario.getEmail() + ". Pulando 2FA.");
                return gerarRespostaComTokens(usuario, null, request, null);
            }
        }

        // Fluxo de Verificação por E-mail (Dispositivo não confiável)
        System.out.println("[Login] Dispositivo não confiável para " + usuario.getEmail() + ". Iniciando verificação por e-mail.");
        AccessModel pendingLogin = accessRepository.findByEmail(usuario.getEmail()).orElse(new AccessModel());
        
        pendingLogin.setEmail(usuario.getEmail());
        pendingLogin.setNome(usuario.getNome());
        pendingLogin.setSenhaCriptografada(usuario.getSenha());
        pendingLogin.setTipo(usuario.getTipo());
        pendingLogin.setUsuarioId(usuario.getId());
        pendingLogin.setCodigoVerificacao(accessService.gerarCodigoDeVerificacao());
        pendingLogin.setExpiracaoCodigo(LocalDateTime.now().plusMinutes(10));
        
        accessRepository.save(pendingLogin);
        
        String urlDeVerificacao = "http://localhost:4200/confirmar-codigo/" + pendingLogin.getId();
        accessService.enviarEmailVerificacao(usuario.getEmail(), usuario.getNome(), pendingLogin.getCodigoVerificacao(), urlDeVerificacao);
        
        return ResponseEntity.ok(Map.of(
            "mensagem", "Código de verificação enviado para o seu e-mail.",
            "idVerificacao", pendingLogin.getId()
        ));
    }
    
    @PostMapping("/verificar")
    public ResponseEntity<?> verificarCodigo(@RequestBody VerificacaoRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        AccessModel pending = accessRepository.findById(request.getIdVerificacao()).orElse(null);
        if (pending == null || !pending.getCodigoVerificacao().equals(request.getCodigo()) || pending.getExpiracaoCodigo().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("erro", "Código de verificação inválido ou expirado."));
        }
        
        Usuario usuario;
        
        if (pending.getUsuarioId() != null) {
            usuario = repo.findById(pending.getUsuarioId()).orElseThrow(() -> 
                new RuntimeException("Usuário associado à verificação não encontrado.")
            );
        } else {
            // Cria o usuário base a partir dos dados pendentes
            usuario = new Usuario();
            usuario.setNome(pending.getNome());
            usuario.setEmail(pending.getEmail());
            usuario.setSenha(pending.getSenhaCriptografada());
            usuario.setTipo(pending.getTipo());
            usuario.setEmailVerificado(true);
            
            try {
                RegistroRequest originalRequest = objectMapper.readValue(pending.getPayload(), RegistroRequest.class);
                usuario.setEndereco(originalRequest.getEndereco());
                usuario.setTelefone(originalRequest.getTelefone());
                
                repo.save(usuario); 
                
                if (usuario.getTipo() == TipoUsuario.CLIENTE) {
                    Cliente cliente = new Cliente();
                    cliente.setUsuario(usuario);
                    repoClient.save(cliente);
                
                } else if (usuario.getTipo() == TipoUsuario.RESTAURANTE) {
                    Restaurante restaurante = new Restaurante();
                    restaurante.setUsuario(usuario);
                    
                    restaurante.setDescricao(originalRequest.getDescricao());
                    restaurante.setTipoCozinha(originalRequest.getTipoCozinha());

                    if (originalRequest.getHoraFuncionamento() != null) {
                        restaurante.setHorariosFuncionamento(originalRequest.getHoraFuncionamento());
                    }

                    if (originalRequest.getNomesServicos() != null && !originalRequest.getNomesServicos().isEmpty()) {
                        Set<Servico> servicosParaAssociar = new HashSet<>();
                        for (String nomeServico : originalRequest.getNomesServicos()) {
                            Servico serv = repoServico.findByNome(nomeServico)
                                            .orElseGet(() -> repoServico.save(new Servico(nomeServico)));
                            servicosParaAssociar.add(serv);
                        }
                        restaurante.setServicos(servicosParaAssociar);
                    }
                    
                    repoRestaurante.save(restaurante);
                }

            } catch (JsonProcessingException e) {
                 return ResponseEntity.internalServerError().body(Map.of("erro", "Falha ao recriar dados do usuário."));
            }
        }
        
        String novoTrustToken = null;
        if (request.isMantenhaMeConectado()) {
            System.out.println("[Verificar] Usuário " + usuario.getEmail() + " marcou 'Mantenha-me conectado'.");
            novoTrustToken = rememberMeService.generateNewToken();
            rememberMeService.storeToken(novoTrustToken, usuario);
        }
        
        accessRepository.delete(pending);
        
        return gerarRespostaComTokens(usuario, novoTrustToken, httpRequest, httpResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        System.out.println("[Logout] Método de logout chamado. Encerrando a sessão atual.");

        // Invalida o refreshToken para encerrar a sessão.
        // O trustToken NÃO é afetado.
        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", "")
            .httpOnly(true)
            .secure(false) // Mudar para true em produção
            .path("/")
            .maxAge(0) // Expira o cookie imediatamente
            .sameSite("Lax")
            .build();

        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

        System.out.println("[Logout] Sessão encerrada. O dispositivo continua sendo confiável.");
        return ResponseEntity.ok(Map.of("mensagem", "Sessão encerrada com sucesso."));
    }

    // --- Outros endpoints (refresh, esqueci-senha, etc.) permanecem iguais ---

    @PostMapping("/reenviar-codigo")
    public ResponseEntity<?> reenviarCodigo(@RequestBody ReenvioRequest request) {
        Optional<AccessModel> pendingOpt = accessRepository.findByEmail(request.getEmail());
        
        if (pendingOpt.isPresent()) {
            AccessModel pending = pendingOpt.get();
            String novoCodigo = accessService.gerarCodigoDeVerificacao();
            pending.setCodigoVerificacao(novoCodigo);
            pending.setExpiracaoCodigo(LocalDateTime.now().plusMinutes(10));
            accessRepository.save(pending);
            
            String urlDeVerificacao = "http://localhost:4200/confirmar-codigo/" + pending.getId();
            accessService.enviarEmailVerificacao(pending.getEmail(), pending.getNome(), novoCodigo, urlDeVerificacao);

            return ResponseEntity.ok(Map.of(
                "mensagem", "Um novo código de verificação foi enviado para o seu e-mail.",
                "idVerificacao", pending.getId()
            ));
        }
        
        return ResponseEntity.ok(Map.of("mensagem", "Se uma verificação estiver pendente para este e-mail, um novo código foi enviado."));
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) { //
        try {
            // ... (lógica para pegar o refreshToken do cookie) ...
            String refreshToken = null; //
            if (request.getCookies() != null) { //
                for (Cookie cookie : request.getCookies()) {
                    if (cookie.getName().equals("refreshToken")) {
                        refreshToken = cookie.getValue();
                        break; 
                    }
                }
            }
            if (refreshToken == null) { //
            	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token não encontrado no cookie."); //
            }
            if (!jwt.isTokenValid(refreshToken)) {  //
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token inválido ou expirado."); //
            }
            
            Usuario usuario = repo.findById(jwt.parseToken(refreshToken).get("id", UUID.class)) //
                .orElseThrow(() -> new RuntimeException("Usuário do token não encontrado.")); //

            String novoAccessToken = jwt.generateAccessToken(usuario.getEmail()); //

            // <<< CORREÇÃO AQUI (EFEITO COLATERAL) >>>
            // Precisamos determinar o restauranteId e construir as URLs
            UUID restauranteId = null;
            if (usuario.getTipo() == TipoUsuario.RESTAURANTE) {
                restauranteId = usuario.getId();
            }
            String urlImagemPerfil = uplUtil.construirUrlRelativa("usuarios", usuario.getImagem());
            String urlImagemPrincipal = uplUtil.construirUrlRelativa("usuarios", usuario.getImagemPrincipal());

            // Passamos os 8 argumentos para o construtor atualizado
            return ResponseEntity.ok(new LoginResponse(
                    novoAccessToken, 
                    usuario.getNome(), 
                    usuario.getTipo().toString(), 
                    usuario.getId(), 
                    usuario.getEmail(),
                    urlImagemPerfil, // ANTES: usuario.getImagem()
                    urlImagemPrincipal, // ANTES: usuario.getImagemPrincipal()
                    restauranteId // <<< ID DO RESTAURANTE ADICIONADO
            ));
            // --- FIM DA CORREÇÃO ---

        } catch (Exception e) { 
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Erro ao processar refresh token: " + e.getMessage()); //
        }
    }
    
    @PostMapping("/esqueci-senha")
    public ResponseEntity<?> solicitarResetSenha(@RequestBody SenhaResetRequest request) {
        accessService.solicitarResetDeSenha(request.getEmail());
        return ResponseEntity.ok(Map.of("mensagem", "Se um usuário com este e-mail existir em nosso sistema, um link de redefinição será enviado."));
    }
    
    @PostMapping("/mudar-senha/{token}")
    public ResponseEntity<?> redefinirSenha(
            @PathVariable String token,
            @RequestBody SenhaResetConfirmRequest request) { // O DTO agora só precisa da nova senha
        try {
            // Passamos o token da URL e a nova senha do corpo para o service
            accessService.executarResetDeSenha(token, request.getNovaSenha());
            return ResponseEntity.ok(Map.of("mensagem", "Sua senha foi redefinida com sucesso."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", e.getMessage()));
        }
    }

    private ResponseEntity<LoginResponse> gerarRespostaComTokens(Usuario usuario, String novoTrustToken, HttpServletRequest request, HttpServletResponse response) { //
        String accessToken = jwt.generateAccessToken(usuario.getEmail()); //
        String refreshTokenString = jwt.generateRefreshToken(usuario.getId(), usuario.getEmail()); //

        // ... (lógica do cookie refreshToken) ...
        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshTokenString)
            .httpOnly(true)
            .secure(false)
            .path("/")
            .maxAge(30 * 24 * 60 * 60)
            .sameSite("Lax")
            .build();
        
        String urlImagemPerfil = uplUtil.construirUrlRelativa("usuarios", usuario.getImagem()); //
        String urlImagemPrincipal = uplUtil.construirUrlRelativa("usuarios", usuario.getImagemPrincipal()); //

        // <<< CORREÇÃO AQUI (EFEITO COLATERAL) >>>
        // Determina o restauranteId
        UUID restauranteId = null;
        if (usuario.getTipo() == TipoUsuario.RESTAURANTE) {
            restauranteId = usuario.getId();
        }

        // Passamos os 8 argumentos para o construtor atualizado
        LoginResponse loginResponse = new LoginResponse(
            accessToken,
            usuario.getNome(),
            usuario.getTipo().toString(),
            usuario.getId(),
            usuario.getEmail(),
            urlImagemPerfil, 
            urlImagemPrincipal,
            restauranteId // <<< ID DO RESTAURANTE ADICIONADO
        );
        // --- FIM DA CORREÇÃO ---

        ResponseEntity.BodyBuilder responseBuilder = ResponseEntity.ok() //
            .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString()); //

        if (novoTrustToken != null && response != null) { //
            addTokenToTrustCookie(request, response, usuario.getId(), novoTrustToken); //
        }

        return responseBuilder.body(loginResponse); //
    }
    
    private Map<String, String> getTrustsMapFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return new HashMap<>();

        for (Cookie cookie : request.getCookies()) {
            if (TRUST_COOKIE_NAME.equals(cookie.getName())) {
                try {
                    String decodedValue = URLDecoder.decode(cookie.getValue(), StandardCharsets.UTF_8);
                    return objectMapper.readValue(decodedValue, new TypeReference<HashMap<String, String>>() {});
                } catch (IOException e) {
                    System.err.println("Erro ao parsear cookie de confiança: " + e.getMessage());
                    return new HashMap<>();
                }
            }
        }
        return new HashMap<>();
    }

    private String getTokenFromTrustCookie(HttpServletRequest request, UUID userId) {
        Map<String, String> trustsMap = getTrustsMapFromCookie(request);
        return trustsMap.get(userId.toString());
    }

    private void addTokenToTrustCookie(HttpServletRequest request, HttpServletResponse response, UUID userId, String token) {
        Map<String, String> trustsMap = getTrustsMapFromCookie(request);
        if(token != null) {
             trustsMap.put(userId.toString(), token);
        }
       
        try {
            String jsonValue = objectMapper.writeValueAsString(trustsMap);
            String encodedValue = URLEncoder.encode(jsonValue, StandardCharsets.UTF_8);
            
            ResponseCookie trustCookie = ResponseCookie.from(TRUST_COOKIE_NAME, encodedValue)
                .httpOnly(true)
                .secure(false) // Mudar para true em produção
                .path("/")
                .maxAge(60 * 24 * 60 * 60) // 60 dias
                .sameSite("Lax")
                .build();

            response.addHeader(HttpHeaders.SET_COOKIE, trustCookie.toString());
        } catch (IOException e) {
            System.err.println("Erro ao criar cookie de confiança: " + e.getMessage());
        }
    }
}