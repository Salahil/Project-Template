package TavolaSoftware.TavolaApp.REST.service;

import TavolaSoftware.TavolaApp.REST.model.Avaliacao;
import TavolaSoftware.TavolaApp.REST.model.Cliente;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.model.Servico;
import TavolaSoftware.TavolaApp.REST.repository.AvaliacaoRepository;
import TavolaSoftware.TavolaApp.REST.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecomendacaoService {

    private static final double PONTOS_TIPO_COZINHA = 30.0;
    private static final double PONTOS_SERVICO_COMPATIVEL = 10.0;
    private static final double PONTOS_FAVORITO = 50.0;
    private static final double PONTOS_BAIRRO_FREQUENTADO = 15.0;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    // Classe interna para ajudar no cálculo do score
    private static class RestauranteComScore {
        // É uma boa prática deixar os campos privados
        private Restaurante restaurante;
        private double score;

        public RestauranteComScore(Restaurante r, double s) { 
            this.restaurante = r; 
            this.score = s; 
        }

        // <<< ADICIONANDO OS MÉTODOS GETTER QUE FALTAVAM >>>
        public Restaurante getRestaurante() {
            return this.restaurante;
        }

        public double getScore() {
            return this.score;
        }
    }

    // Classe interna para guardar o perfil de preferências do usuário
    private static class PerfilUsuario {
        Set<String> tiposCozinhaFavoritos = new HashSet<>();
        Set<String> servicosFavoritos = new HashSet<>();
        Set<String> bairrosFrequentados = new HashSet<>();
        Set<UUID> restaurantesAvaliados = new HashSet<>();
        List<UUID> restaurantesFavoritos = new ArrayList<>();
        String cidadePrincipal;
        boolean isNovoUsuario = true;
    }
    
    public List<Restaurante> ordenarRestaurantesPorRecomendacao(List<Restaurante> todosRestaurantes, UUID clienteId) {
        Optional<Cliente> clienteOpt = clienteRepository.findById(clienteId);
        if (clienteOpt.isEmpty()) {
            return todosRestaurantes;
        }
        
        PerfilUsuario perfil = construirPerfilDoUsuario(clienteOpt.get());

        if (perfil.isNovoUsuario) {
            return ordenarParaNovoUsuario(todosRestaurantes, perfil.cidadePrincipal);
        }

        List<RestauranteComScore> restaurantesComScore = todosRestaurantes.stream()
                .filter(r -> !perfil.restaurantesAvaliados.contains(r.getId()))
                .map(r -> new RestauranteComScore(r, calcularScore(r, perfil)))
                .collect(Collectors.toList());

        // Agora esta linha vai funcionar, pois RestauranteComScore::getScore existe!
        restaurantesComScore.sort(Comparator.comparingDouble(RestauranteComScore::getScore).reversed());

        // E esta também, pois RestauranteComScore::getRestaurante existe!
        return restaurantesComScore.stream()
                .map(RestauranteComScore::getRestaurante)
                .collect(Collectors.toList());
    }
    
    private PerfilUsuario construirPerfilDoUsuario(Cliente cliente) {
        PerfilUsuario perfil = new PerfilUsuario();
        if (cliente.getUsuario() != null && cliente.getUsuario().getEndereco() != null) {
            perfil.cidadePrincipal = cliente.getUsuario().getEndereco().getCidade();
        }
        perfil.restaurantesFavoritos = cliente.getFavoritos();

        List<Avaliacao> avaliacoes = avaliacaoRepository.findByClienteId(cliente.getId());
        perfil.restaurantesAvaliados = avaliacoes.stream()
            .map(a -> a.getRestaurante().getId())
            .collect(Collectors.toSet());
        
        List<Avaliacao> positivas = avaliacoes.stream()
            .filter(a -> a.getScore() >= 4)
            .collect(Collectors.toList());

        if (positivas.isEmpty() && perfil.restaurantesFavoritos.isEmpty()) {
            perfil.isNovoUsuario = true;
            return perfil;
        }
        perfil.isNovoUsuario = false;

        for (Avaliacao a : positivas) {
            Restaurante r = a.getRestaurante();
            if (r != null) {
                if (r.getTipoCozinha() != null) {
                    perfil.tiposCozinhaFavoritos.add(r.getTipoCozinha());
                }
                if (r.getEndereco() != null && r.getEndereco().getBairro() != null) {
                    perfil.bairrosFrequentados.add(r.getEndereco().getBairro());
                }
                if (r.getServicos() != null) {
                    r.getServicos().forEach(s -> perfil.servicosFavoritos.add(s.getNome()));
                }
            }
        }
        return perfil;
    }

    private double calcularScore(Restaurante restaurante, PerfilUsuario perfil) {
        double score = 0.0;
        
        if (perfil.restaurantesFavoritos.contains(restaurante.getId())) {
            score += PONTOS_FAVORITO;
        }

        if (perfil.tiposCozinhaFavoritos.contains(restaurante.getTipoCozinha())) {
            score += PONTOS_TIPO_COZINHA;
        }

        if (restaurante.getEndereco() != null && perfil.bairrosFrequentados.contains(restaurante.getEndereco().getBairro())) {
            score += PONTOS_BAIRRO_FREQUENTADO;
        }

        if (restaurante.getServicos() != null) {
            for (Servico servico : restaurante.getServicos()) {
                if (perfil.servicosFavoritos.contains(servico.getNome())) {
                    score += PONTOS_SERVICO_COMPATIVEL;
                }
            }
        }
        
        return score;
    }
    
    private List<Restaurante> ordenarParaNovoUsuario(List<Restaurante> restaurantes, String cidade) {
        if (cidade == null) return restaurantes;
        
        return restaurantes.stream()
                .filter(r -> r.getEndereco() != null && cidade.equalsIgnoreCase(r.getEndereco().getCidade()))
                .sorted(Comparator.comparing(Restaurante::getMediaAvaliacao).reversed()
                                  .thenComparing(Restaurante::getTotalDeAvaliacoes).reversed())
                .collect(Collectors.toList());
    }
}