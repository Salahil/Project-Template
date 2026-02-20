package TavolaSoftware.TavolaApp.REST.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import TavolaSoftware.TavolaApp.REST.dto.requests.RestauranteRequest;
import TavolaSoftware.TavolaApp.REST.dto.responses.ClienteHomeResponse;
import TavolaSoftware.TavolaApp.REST.dto.responses.RestauranteResponse;
import TavolaSoftware.TavolaApp.REST.model.Cardapio;
import TavolaSoftware.TavolaApp.REST.model.Cliente;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.model.Servico;
import TavolaSoftware.TavolaApp.REST.model.Usuario;
import TavolaSoftware.TavolaApp.REST.repository.ClienteRepository;
import TavolaSoftware.TavolaApp.REST.repository.RestauranteRepository;
import TavolaSoftware.TavolaApp.REST.repository.ServicoRepository;
import TavolaSoftware.TavolaApp.REST.repository.UsuarioRepository;
import TavolaSoftware.TavolaApp.tools.TipoUsuario;
import TavolaSoftware.TavolaApp.tools.UploadUtils;

@Service
public class RestauranteService {

    @Autowired private RestauranteRepository repoRestaurante;
    @Autowired private UsuarioRepository repoUsuario;
    @Autowired private ServicoRepository repoServico;
    @Autowired private UploadUtils uplUtil;
    @Autowired private BCryptPasswordEncoder encoder;
    @Autowired private RecomendacaoService recomendacaoService;
    @Autowired private ClienteRepository clienteRepository;
    @Autowired private ReservaService reservaService;
    
    @Transactional(readOnly = true)
    public List<ClienteHomeResponse> findByCidade(String cidade) {
        if (cidade == null || cidade.trim().isEmpty()) {
            return new ArrayList<>();
        }

        List<Restaurante> restaurantes = repoRestaurante.findByUsuarioEnderecoCidadeIgnoreCase(cidade.trim());
        
        // --- LÓGICA ATUALIZADA ---
        // Precisamos montar a URL da imagemPrincipal aqui
        return restaurantes.stream()
            .map(restaurante -> {
                ClienteHomeResponse dto = new ClienteHomeResponse(restaurante);
                // Monta a URL completa para a imagem principal
                dto.setImagemPrincipal(uplUtil.construirUrlRelativa("restaurantes", restaurante.getImagemPrincipal()));
                return dto;
            })
            .collect(Collectors.toList());
    }
    
    // ... (método calcularValorMedioPorPessoa sem alterações) ...
    private double calcularValorMedioPorPessoa(Restaurante restaurante) {
        if (restaurante.getCardapio() == null || restaurante.getCardapio().isEmpty()) {
            return 0.0;
        }

        Map<String, List<Cardapio>> cardapioPorCategoria = restaurante.getCardapio().stream()
                .filter(item -> item.getCategoria() != null && item.getPreco() != 0.0 && item.getPreco() > 0.0)
                .collect(Collectors.groupingBy(item -> item.getCategoria().getNome()));

        double valorTotalDasMedias = cardapioPorCategoria.values().stream()
                .mapToDouble(itensDaCategoria -> 
                    itensDaCategoria.stream()
                                    .mapToDouble(Cardapio::getPreco)
                                    .average()
                                    .orElse(0.0)
                )
                .sum();
        
        return BigDecimal.valueOf(valorTotalDasMedias).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
    
    // ... (método getFavoritosDoClienteLogado sem alterações) ...
    private List<UUID> getFavoritosDoClienteLogado() {
        try {
            String emailUsuarioLogado = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            
            return repoUsuario.findByEmail(emailUsuarioLogado)
                    .filter(usuario -> usuario.getTipo() == TipoUsuario.CLIENTE)
                    .flatMap(usuario -> clienteRepository.findById(usuario.getId()))
                    .map(Cliente::getFavoritos)
                    .orElse(Collections.emptyList());
        } catch (Exception e) {
            // Ignora e retorna lista vazia em caso de qualquer erro
        }
        return Collections.emptyList();
    }

    public List<RestauranteResponse> findAll() {
        List<Restaurante> restaurantes = repoRestaurante.findAll();
        
        try {
            String emailUsuarioLogado = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Optional<Usuario> usuarioOpt = repoUsuario.findByEmail(emailUsuarioLogado);
            if (usuarioOpt.isPresent() && usuarioOpt.get().getTipo() == TipoUsuario.CLIENTE) {
                recomendacaoService.ordenarRestaurantesPorRecomendacao(restaurantes, usuarioOpt.get().getId());
            }
        } catch (Exception e) {
            System.err.println("Não foi possível ordenar por recomendação (usuário não é cliente ou não está logado): " + e.getMessage());
        }
        
        List<UUID> favoritosDoCliente = getFavoritosDoClienteLogado();

        return restaurantes.stream().map(restaurante -> {
            RestauranteResponse responseDto = new RestauranteResponse(restaurante);

            responseDto.setFavorito(favoritosDoCliente.contains(restaurante.getId()));
            responseDto.setValorMedioPorPessoa(calcularValorMedioPorPessoa(restaurante));
            responseDto.setDatasLotadas(reservaService.getDatasLotadas(restaurante.getId()));
            responseDto.setImagemPrincipal(uplUtil.construirUrlRelativa("restaurantes", restaurante.getImagemPrincipal()));

            return responseDto;
        }).collect(Collectors.toList());
    }

    public Optional<RestauranteResponse> findById(UUID id) {
        return repoRestaurante.findById(id).map(restaurante -> {
            RestauranteResponse responseDto = new RestauranteResponse(restaurante);

            Usuario usuario = restaurante.getUsuario();
            responseDto.setImagemUsuario(uplUtil.construirUrlRelativa("usuarios", usuario.getImagem()));
            
            // --- LÓGICA ATUALIZADA ---
            // Corrigido para usar o método 'getImagemPrincipal()'
            responseDto.setImagemPrincipalUsuario(uplUtil.construirUrlRelativa("usuarios", usuario.getImagemPrincipal())); 
            
            // 1. Montar a URL da Imagem Principal do Restaurante
            responseDto.setImagemPrincipal(uplUtil.construirUrlRelativa("restaurantes", restaurante.getImagemPrincipal()));

            // 2. Montar as URLs da Galeria
            if (restaurante.getImagens() != null) {
                List<String> urlsGaleria = restaurante.getImagens().stream()
                    .map(nomeArquivo -> uplUtil.construirUrlRelativa("restaurantes", nomeArquivo))
                    .collect(Collectors.toList());
                responseDto.setImagens(urlsGaleria); // 'imagens' agora é a galeria
            } else {
                 responseDto.setImagens(Collections.emptyList());
            }
            // --- FIM DA ATUALIZAÇÃO ---
            
            responseDto.setFavorito(getFavoritosDoClienteLogado().contains(restaurante.getId()));
            responseDto.setValorMedioPorPessoa(calcularValorMedioPorPessoa(restaurante));
            responseDto.setDatasLotadas(reservaService.getDatasLotadas(restaurante.getId()));

            return responseDto;
        });
    }
    
    @Transactional
    public Restaurante saveFromRequest(RestauranteRequest request) {
    	if (repoUsuario.findByEmail(request.getEmailUsuario()).isPresent()) {
            throw new RuntimeException("Email já está em uso.");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(request.getNomeUsuario()); 
        usuario.setEmail(request.getEmailUsuario()); 
        usuario.setSenha(encoder.encode(request.getSenhaUsuario())); 
        usuario.setEndereco(request.getEnderecoUsuario()); 
        usuario.setTipo(TipoUsuario.RESTAURANTE);
        if (request.getTelefoneUsuario() != null && !request.getTelefoneUsuario().isBlank()) {
            usuario.setTelefone(request.getTelefoneUsuario());
        }
        Usuario usuarioSalvo = repoUsuario.save(usuario);

        Restaurante restaurante = new Restaurante();
        restaurante.setUsuario(usuarioSalvo);
        
        if (request.getDescricao() != null && !request.getDescricao().isBlank()) {
            restaurante.setDescricao(request.getDescricao());
        }
        
        if (request.getTipoCozinha() != null && !request.getTipoCozinha().isBlank()) {
            restaurante.setTipoCozinha(request.getTipoCozinha());
        } else {
            restaurante.setTipoCozinha(null);
        }
        
        if (request.getHorariosFuncionamento() != null) {
            restaurante.setHorariosFuncionamento(request.getHorariosFuncionamento()); 
        }
        
        if (request.getNomesServicos() != null && !request.getNomesServicos().isEmpty()) { 
            Set<Servico> servicosParaAssociar = new HashSet<>();
            for (String nomeServico : request.getNomesServicos()) { 
                Servico serv = repoServico.findByNome(nomeServico)
                                .orElseGet(() -> repoServico.save(new Servico(nomeServico)));
                servicosParaAssociar.add(serv);
            }
            restaurante.setServicos(servicosParaAssociar); 
        }

        try {
            // --- LÓGICA ATUALIZADA ---
            // 1. Processar a Imagem Principal (Fachada)
            if (request.getImagemPrincipal() != null && !request.getImagemPrincipal().isBlank()) {
                String nomeArquivoPrincipal = uplUtil.processRestauranteImagemPrincipal(request.getImagemPrincipal());
                restaurante.setImagemPrincipal(nomeArquivoPrincipal);
            }

            // 2. Processar a Galeria de Imagens
            if (request.getImagens() != null && !request.getImagens().isEmpty()) { 
                List<String> nomesArquivosGaleria = uplUtil.processRestauranteGaleria(request.getImagens());
                restaurante.setImagens(nomesArquivosGaleria);
            }
            // --- FIM DA ATUALIZAÇÃO ---
        } catch (IOException e) {
            throw new RuntimeException("Erro ao processar imagens do restaurante: " + e.getMessage(), e);
        }
        
        return repoRestaurante.save(restaurante);
    }
    
    @Transactional
    public Restaurante updateFromRequest(UUID id, RestauranteRequest request) {
        Restaurante restauranteExistente = repoRestaurante.findById(id)
            .orElseThrow(() -> new RuntimeException("Restaurante não encontrado com ID: " + id));
        Usuario usuarioAssociado = restauranteExistente.getUsuario();

        // ... (lógica de atualização do usuário) ...
        if (request.getNomeUsuario() != null && !request.getNomeUsuario().isBlank()) {
            usuarioAssociado.setNome(request.getNomeUsuario());
        }
        if (request.getEnderecoUsuario() != null) {
            usuarioAssociado.setEndereco(request.getEnderecoUsuario());
        }
        if (request.getTelefoneUsuario() != null) {
            usuarioAssociado.setTelefone(request.getTelefoneUsuario());
        }
        repoUsuario.save(usuarioAssociado);

        // ... (lógica de atualização do restaurante: tipoCozinha, descricao, etc.) ...
        if (request.getTipoCozinha() != null && !request.getTipoCozinha().isBlank()) {
            restauranteExistente.setTipoCozinha(request.getTipoCozinha());
        }
        if (request.getDescricao() != null) {
            restauranteExistente.setDescricao(request.getDescricao());
        }
        if (request.getHorariosFuncionamento() != null) {
            restauranteExistente.setHorariosFuncionamento(request.getHorariosFuncionamento());
        }
        if (request.getNomesServicos() != null) {
           Set<Servico> servicosParaAssociar = new HashSet<>();
           for (String nomeServico : request.getNomesServicos()) {
               Servico serv = repoServico.findByNome(nomeServico)
                               .orElseGet(() -> repoServico.save(new Servico(nomeServico)));
               servicosParaAssociar.add(serv);
           }
           restauranteExistente.setServicos(servicosParaAssociar);
        }
        if (request.getLimiteReservasDiarias() != null && request.getLimiteReservasDiarias() >= 0) {
           restauranteExistente.setLimiteReservasDiarias(request.getLimiteReservasDiarias());
        }
       
        try {
            // --- LÓGICA ATUALIZADA ---
            
            // 1. Processar a Imagem Principal (Fachada)
            // Se uma nova imagem (Base64) ou um nome de arquivo diferente foi enviado
            if (request.getImagemPrincipal() != null) { 
                String nomeAntigo = restauranteExistente.getImagemPrincipal();
                String nomeNovo = uplUtil.processRestauranteImagemPrincipal(request.getImagemPrincipal());
                
                restauranteExistente.setImagemPrincipal(nomeNovo);

                // Deletar a imagem antiga se ela mudou
                if (nomeAntigo != null && !nomeAntigo.equals(nomeNovo)) {
                    String urlAntiga = uplUtil.construirUrlRelativa("restaurantes", nomeAntigo);
                    uplUtil.deletarArquivoPeloCaminho(urlAntiga);
                }
            }

            // 2. Processar a Galeria de Imagens
            if (request.getImagens() != null) {
                List<String> nomesArquivosAtuais = restauranteExistente.getImagens() != null ? new ArrayList<>(restauranteExistente.getImagens()) : new ArrayList<>();
                List<String> nomesArquivosProcessados = uplUtil.processRestauranteGaleria(request.getImagens());

                // Deletar imagens da galeria que foram removidas
                for (String nomeAntigo : nomesArquivosAtuais) {
                    if (!nomesArquivosProcessados.contains(nomeAntigo)) {
                        String urlAntigaGaleria = uplUtil.construirUrlRelativa("restaurantes", nomeAntigo);
                        uplUtil.deletarArquivoPeloCaminho(urlAntigaGaleria);
                    }
                }
                restauranteExistente.setImagens(nomesArquivosProcessados);
            }
            // --- FIM DA ATUALIZAÇÃO ---
        } catch (IOException e) {
            throw new RuntimeException("Erro ao processar imagens do restaurante: " + e.getMessage(), e);
        }

        return repoRestaurante.save(restauranteExistente);
    }

    // ... (método deleteById e getByEmail sem alterações) ...
    @Transactional
    public void deleteById(UUID id) {
        if (repoRestaurante.existsById(id)) {
            repoRestaurante.deleteById(id);
            
        } else {
            throw new RuntimeException("Restaurante não encontrado para deleção com ID: " + id);
        }
    }
    
    public Restaurante getByEmail(String email) {
    	Usuario usuario = repoUsuario.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + email));

            return repoRestaurante.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Restaurante não encontrado para o usuário: " + email));
    }
    
    public Optional<Restaurante> findEntityById(UUID id) {
        return repoRestaurante.findById(id);
    }
}