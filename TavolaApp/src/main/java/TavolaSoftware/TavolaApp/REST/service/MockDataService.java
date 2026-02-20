package TavolaSoftware.TavolaApp.REST.service;

import TavolaSoftware.TavolaApp.REST.dto.requests.AvaliacaoRequest;
import TavolaSoftware.TavolaApp.REST.model.*;
import TavolaSoftware.TavolaApp.REST.repository.*;
import TavolaSoftware.TavolaApp.tools.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class MockDataService {

    private static final AtomicInteger mockUserCounter = new AtomicInteger(0);
    private static final AtomicInteger clienteIndexGlobal = new AtomicInteger(0);
    
    // Cache para evitar tentar restaurantes cheios na mesma execução
    private final Set<UUID> restaurantesCheiosHoje = new HashSet<>();

    // Listas pré-carregadas dos TXTs
    private final List<String> nomesEstabelecimentos;
    private final List<String> nomesPratos;
    private final List<String> nomesClientes;
    private final List<String> sobrenomesClientes;
    private final List<String> tiposCozinha;
    private final List<String> avaliacoesPositivas;
    private final List<String> avaliacoesNegativas;

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private RestauranteRepository restauranteRepository;
    @Autowired private ClienteRepository clienteRepository;
    @Autowired private GarcomRepository garcomRepository;
    @Autowired private AmbienteRepository ambienteRepository;
    @Autowired private MesaRepository mesaRepository;
    @Autowired private CardapioRepository cardapioRepository;
    @Autowired private CategoriaService categoriaService;
    @Autowired private ReservaRepository reservaRepository;
    @Autowired private ReservaService reservaService;
    @Autowired private AvaliacaoService avaliacaoService;
    @Autowired private AtendimentoMesaService atendimentoMesaService;
    @Autowired private PedidoService pedidoService;
    @Autowired private BCryptPasswordEncoder passwordEncoder;
    @Autowired private UploadUtils uploadUtils;

    // --- CORREÇÃO DO PROXY BYPASS ---
    // Injetamos a própria classe para garantir que as anotações @Transactional funcionem
    @Autowired
    @Lazy // Lazy para evitar Dependência Circular na inicialização
    private MockDataService self; 

    public MockDataService() {
        nomesEstabelecimentos = loadTxtFile("mock-data/estabelecimentos.txt");
        nomesPratos = loadTxtFile("mock-data/pratos.txt");
        nomesClientes = loadTxtFile("mock-data/nomes.txt");
        sobrenomesClientes = loadTxtFile("mock-data/sobrenomes.txt");
        tiposCozinha = loadTxtFile("mock-data/cozinha.txt");
        avaliacoesPositivas = loadTxtFile("mock-data/avaliacaopositiva.txt");
        avaliacoesNegativas = loadTxtFile("mock-data/avaliacaonegativa.txt");
        
        // Validação simples para garantir que os arquivos existem
        if(nomesPratos.isEmpty()) System.err.println("ALERTA MOCK: pratos.txt vazio ou não encontrado!");
    }

    // ============================================================================================
    //  CRIAÇÃO DE RESTAURANTE
    // ============================================================================================

    @Transactional
    public Restaurante createMockRestaurante() {
        String email = String.format("restaurante%04d@tavola.com", mockUserCounter.getAndIncrement());
        
        Usuario usuario = new Usuario();
        usuario.setNome(getRandom(nomesEstabelecimentos));
        usuario.setEmail(email);
        usuario.setSenha(passwordEncoder.encode("senha"));
        usuario.setTipo(TipoUsuario.RESTAURANTE);
        usuario.setEmailVerificado(true);
        usuario.setEndereco(getPasseioDasAguasAddress());
        usuario.setTelefone("6299" + randomInt(1000, 9999));
        
        String imgPath = "/upl/mock/restaurantes/" + randomInt(0, 9) + ".jpeg";
        usuario.setImagemPrincipal(imgPath);
        usuario.setImagem(imgPath);

        usuarioRepository.save(usuario);

        Restaurante restaurante = new Restaurante();
        restaurante.setUsuario(usuario);
        restaurante.setTipoCozinha(getRandom(tiposCozinha));
        restaurante.setDescricao("Restaurante especializado em " + restaurante.getTipoCozinha() + ".");
        restaurante.setHorariosFuncionamento(getHorariosMock());
        restaurante.setImagemPrincipal(imgPath);
        restaurante.setMediaAvaliacao(0.0);
        restaurante.setTotalDeAvaliacoes(0);

        usuarioRepository.save(usuario);
        restauranteRepository.save(restaurante);

        createMockGarcons(restaurante, 3);
        createMockAmbientes(restaurante);
        
        // Garante que o cardápio seja criado
        if (!nomesPratos.isEmpty()) {
            createMockCardapio(restaurante, 12); // Cria 12 itens
        } else {
            System.err.println("MOCK AVISO: Cardápio não criado pois a lista de pratos está vazia.");
        }

        return restaurante;
    }

    private void createMockGarcons(Restaurante restaurante, int quantidade) {
        for (int i = 0; i < quantidade; i++) {
            Garcom garcom = new Garcom();
            garcom.setRestaurante(restaurante);
            garcom.setNome(getRandom(nomesClientes) + " (Garçom)"); 
            garcom.setSenha(passwordEncoder.encode("senha"));
            garcom.setCodigoIdentidade(gerarCodigoUnico(restaurante.getId()));
            garcom.setImagem("/upl/mock/garcons/" + randomInt(0, 9) + ".jpeg");
            garcomRepository.save(garcom);
        }
    }

    private void createMockAmbientes(Restaurante restaurante) {
        Ambiente principal = new Ambiente();
        principal.setNome("Salão Principal");
        principal.setRestaurante(restaurante);
        ambienteRepository.save(principal);
        createMockMesas(principal, 6, "Mesa ");

        Ambiente varanda = new Ambiente();
        varanda.setNome("Varanda");
        varanda.setRestaurante(restaurante);
        ambienteRepository.save(varanda);
        createMockMesas(varanda, 4, "Varanda ");
    }

    private void createMockMesas(Ambiente ambiente, int quantidade, String prefixo) {
        for (int i = 1; i <= quantidade; i++) {
            Mesa mesa = new Mesa();
            mesa.setAmbiente(ambiente);
            mesa.setNome(prefixo + i);
            mesa.setCapacidade(4);
            mesa.setStatus(MesaStatus.LIVRE);
            mesaRepository.save(mesa);
        }
    }

    private void createMockCardapio(Restaurante restaurante, int quantidade) {
        // Garante a criação das categorias antes
        Categoria entrada = categoriaService.saveIfNotExists("Entradas", restaurante);
        Categoria principal = categoriaService.saveIfNotExists("Prato Principal", restaurante);
        Categoria bebida = categoriaService.saveIfNotExists("Bebidas", restaurante);
        Categoria sobremesa = categoriaService.saveIfNotExists("Sobremesa", restaurante);
        
        List<Categoria> categorias = List.of(entrada, principal, bebida, sobremesa);

        for (int i = 0; i < quantidade; i++) {
            Cardapio item = new Cardapio();
            item.setRestaurante(restaurante);
            item.setDisponivel(true);
            
            // Distribuição ciclica de categorias
            item.setCategoria(categorias.get(i % categorias.size()));
            
            // Garante nomes variados
            String nomePratoBase = getRandom(nomesPratos);
            item.setNome(nomePratoBase + " " + (i + 1)); 
            
            item.setImagem("/upl/mock/cardapios/" + (i % 10) + ".jpeg");
            item.setDescricao("Descrição deliciosa para " + nomePratoBase);
            item.setPreco(randomDouble(25.00, 120.00));
            
            cardapioRepository.save(item);
        }
        // Force flush para garantir que os itens vão para o banco
        cardapioRepository.flush();
    }

    // ============================================================================================
    //  CRIAÇÃO DE CLIENTE (USANDO SELF-INJECTION PARA TRANSAÇÕES REAIS)
    // ============================================================================================

    // NOTA: Este método NÃO tem @Transactional propositalmente.
    // Ele orquestra chamadas transactionais independentes.
    public Cliente createMockCliente(List<UUID> idsRestaurantesMock) {
        int indiceClienteAtual = clienteIndexGlobal.getAndIncrement();
        
        // 1. Criar o Cliente (Chama via 'self' para abrir nova transação)
        Cliente cliente = self.createClienteBase();

        if (idsRestaurantesMock == null || idsRestaurantesMock.isEmpty()) return cliente;

        // 2. Reserva PASSADA
        try {
            UUID idRestHistorico = idsRestaurantesMock.get(randomInt(0, idsRestaurantesMock.size() - 1));
            self.createMockReservaPassada(cliente, idRestHistorico);
        } catch (Exception e) {
            System.err.println("Log Mock: Falha no histórico para cliente " + cliente.getId() + " (Ignorado)");
        }

        // 3. Sessão ATIVA (Atendimento ocorrendo AGORA)
        List<UUID> candidatosSessao = new ArrayList<>(idsRestaurantesMock);
        Collections.shuffle(candidatosSessao);
        
        // Tenta encontrar um restaurante onde consiga sentar AGORA
        boolean sessaoCriada = false;
        for (UUID restId : candidatosSessao) {
            // Se já falhou hoje, pula para economizar tempo
            if (restaurantesCheiosHoje.contains(restId)) continue;

            try {
                // Chama via 'self' para garantir que se falhar, faz rollback só da tentativa
                self.createMockSessaoAtiva(cliente, restId);
                sessaoCriada = true;
                break; // Sucesso, sai do loop
            } catch (Exception e) {
                // Marca restaurante como cheio para não tentar de novo nesta execução em lote
                restaurantesCheiosHoje.add(restId);
            }
        }

        // 4. Reservas FUTURAS (Round-Robin)
        try {
            self.createMockReservasFuturas(cliente, idsRestaurantesMock, indiceClienteAtual);
        } catch (Exception e) {
            System.err.println("Log Mock: Falha nas reservas futuras (Ignorado)");
        }

        return cliente;
    }

    // --- MÉTODOS ATÓMICOS (Chamados via 'self') ---

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Cliente createClienteBase() {
        String email = String.format("cliente%04d@tavola.com", mockUserCounter.getAndIncrement());
        
        Usuario usuario = new Usuario();
        usuario.setNome(getRandom(nomesClientes) + " " + getRandom(sobrenomesClientes));
        usuario.setEmail(email);
        usuario.setSenha(passwordEncoder.encode("senha"));
        usuario.setTipo(TipoUsuario.CLIENTE);
        usuario.setEmailVerificado(true);
        usuario.setEndereco(getCerradoAddress());
        usuario.setTelefone("6299" + randomInt(1000, 9999));
        usuario.setImagem("/upl/mock/usuarios/" + randomInt(0, 9) + ".jpeg");
        
        usuarioRepository.save(usuario);

        Cliente cliente = new Cliente();
        cliente.setUsuario(usuario);
        Cliente salvo = clienteRepository.save(cliente);
        
        // IMPORTANTE: Força a ida ao banco imediatamente
        clienteRepository.flush(); 
        return salvo;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createMockReservaPassada(Cliente cliente, UUID restauranteId) {
        Restaurante restaurante = restauranteRepository.findById(restauranteId).orElseThrow();
        LocalDate dataPassada = LocalDate.now().minusDays(randomInt(5, 30));
        LocalTime hora = LocalTime.of(19, 0);

        Mesa mesa = findFirstAvailableMesa(restauranteId, dataPassada, hora, 2);
        
        Reserva reserva = reservaService.criarReservaMock(
            cliente, restaurante, mesa, 
            dataPassada, hora, 
            randomInt(2, 4), StatusReserva.CONCLUIDA
        );
        
        // Garante que a reserva existe antes de avaliar
        reservaRepository.flush();

        createMockAvaliacao(cliente, restaurante, reserva);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createMockSessaoAtiva(Cliente cliente, UUID restauranteId) {
        // Verifica se há mesas e cardápio
        List<Cardapio> cardapio = cardapioRepository.findAllDisponiveisByRestaurante(restauranteId);
        List<Garcom> garcons = garcomRepository.findAllByRestauranteId(restauranteId);
        
        if (cardapio.isEmpty() || garcons.isEmpty()) {
            throw new RuntimeException("Restaurante incompleto (sem pratos ou garçons)");
        }

        // Tenta achar mesa LIVRE AGORA
        Mesa mesaAtiva = findFirstAvailableMesa(restauranteId, LocalDate.now(), LocalTime.now(), 2);
        Garcom garcom = garcons.get(randomInt(0, garcons.size() - 1));
        Cardapio itemPedido = cardapio.get(randomInt(0, cardapio.size() - 1));

        // 1. Reserva ATIVA (futura imediata)
        reservaService.criarReservaMock(
            cliente, restauranteRepository.getReferenceById(restauranteId), mesaAtiva, 
            LocalDate.now(), LocalTime.now().plusMinutes(60), 
            2, StatusReserva.ATIVA
        );

        // 2. Inicia Atendimento
        atendimentoMesaService.iniciarAtendimentoMock(mesaAtiva, garcom);

        // 3. Pedido
        pedidoService.criarPedidoMock(mesaAtiva, cliente, garcom, itemPedido);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createMockReservasFuturas(Cliente cliente, List<UUID> idsRestaurantes, int indiceCliente) {
        int totalRestaurantes = idsRestaurantes.size();
        
        for (int i = 1; i <= 6; i++) {
            // Lógica Round-Robin para distribuir carga
            int indiceRestaurante = (indiceCliente + i) % totalRestaurantes;
            UUID restId = idsRestaurantes.get(indiceRestaurante);
            
            try {
                LocalDate dataFutura = LocalDate.now().plusDays(i);
                LocalTime hora = LocalTime.of(20, 0);
                
                Mesa mesa = findFirstAvailableMesa(restId, dataFutura, hora, 2);
                
                reservaService.criarReservaMock(
                    cliente, restauranteRepository.getReferenceById(restId), mesa, 
                    dataFutura, hora, 
                    randomInt(2, 4), StatusReserva.CONFIRMADA
                );
            } catch (Exception e) {
                // Pula dia/restaurante se cheio
            }
        }
    }

    // ============================================================================================
    //  AUXILIARES
    // ============================================================================================

    private void createMockAvaliacao(Cliente cliente, Restaurante restaurante, Reserva reserva) {
        int score = randomInt(1, 5);
        String comentario = (score <= 3) ? getRandom(avaliacoesNegativas) : getRandom(avaliacoesPositivas);
        
        AvaliacaoRequest request = new AvaliacaoRequest();
        request.setScore((double) score);
        request.setComentario(comentario);
        
        try {
            avaliacaoService.submeterMockAvaliacao(request, restaurante.getId(), cliente.getUsuario().getEmail(), reserva);
        } catch (Exception e) {
            // Falha silenciosa na avaliação não é crítica
        }
    }

    private Mesa findFirstAvailableMesa(UUID restauranteId, LocalDate data, LocalTime hora, int capacidade) {
        List<Mesa> mesasDisponiveis = mesaRepository.findMesasDisponiveis(restauranteId, data, hora, capacidade);
        if (mesasDisponiveis.isEmpty()) {
            throw new RuntimeException("Mesa indisponível");
        }
        return mesasDisponiveis.get(0); 
    }

    private List<String> loadTxtFile(String path) {
        try {
            InputStream is = new ClassPathResource(path).getInputStream();
            return new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))
                    .lines()
                    .map(line -> line.replaceAll("^[0-9]+\\.", "").trim()) // Remove numeração "1." se houver
                    .toList();
        } catch (IOException e) {
            return new ArrayList<>();
        }
    }

    private String getRandom(List<String> list) {
        if (list == null || list.isEmpty()) return "Genérico";
        return list.get(randomInt(0, list.size() - 1));
    }

    private List<HorarioFuncionamento> getHorariosMock() {
        return Arrays.stream(DiaDaSemana.values())
            .map(dia -> {
                HorarioFuncionamento hf = new HorarioFuncionamento();
                hf.setDiaSemana(dia.getNomeBanco());
                hf.setAbertura("09:00");
                hf.setFechamento("23:59");
                return hf;
            }).collect(Collectors.toList());
    }

    private Endereco getPasseioDasAguasAddress() {
        Endereco end = new Endereco();
        end.setCep("74573-260");
        end.setCidade("Goiânia");
        end.setEstado("GO");
        end.setBairro("Fazenda Caveiras");
        end.setRua("Av. Perimetral Norte, 8303");
        end.setNumero("8303");
        end.setComplemento("Shopping Passeio");
        return end;
    }
    
    private Endereco getCerradoAddress() {
        Endereco end = new Endereco();
        end.setCep("74435-090");
        end.setCidade("Goiânia");
        end.setEstado("GO");
        end.setBairro("Aeroviário");
        end.setRua("Av. Anhanguera, 10790");
        end.setNumero("10790");
        end.setComplemento("Shopping Cerrado");
        return end;
    }

    private int randomInt(int min, int max) {
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }
    
    private double randomDouble(double min, double max) {
        double val = ThreadLocalRandom.current().nextDouble(min, max);
        return Math.round(val * 100.0) / 100.0;
    }
    
    private String gerarCodigoUnico(UUID restauranteId) {
        int numero = 10000000 + randomInt(0, 89999999);
        String s = String.valueOf(numero);
        return s.substring(0, 4) + "-" + s.substring(4);
    }
}