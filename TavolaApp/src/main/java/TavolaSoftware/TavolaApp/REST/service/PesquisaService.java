package TavolaSoftware.TavolaApp.REST.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import TavolaSoftware.TavolaApp.REST.dto.requests.PesquisaRequest;
import TavolaSoftware.TavolaApp.REST.dto.responses.ClienteHomeResponse;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.repository.RestauranteRepository;
import TavolaSoftware.TavolaApp.REST.repository.specification.RestauranteSpecification;

@Service
public class PesquisaService {

    @Autowired
    private RestauranteRepository restauranteRepository;

public List<ClienteHomeResponse> pesquisar(PesquisaRequest request) {
        
        // --- CONSTRUÇÃO DINÂMICA DA CONSULTA COM SPECIFICATIONS ---
        // Começamos com uma Specification "vazia" que não filtra nada.
        Specification<Restaurante> spec = Specification.where(null);

        // Adicionamos o filtro de TERMO, se ele existir.
        if (request.getTermo() != null && !request.getTermo().isBlank()) {
            spec = spec.and(RestauranteSpecification.comTermo(request.getTermo()));
        }

        // Adicionamos o filtro de CIDADE, se ele existir.
        if (request.getCidade() != null && !request.getCidade().isBlank()) {
            spec = spec.and(RestauranteSpecification.comCidade(request.getCidade()));
        }

        // Adicionamos os outros filtros...
        spec = spec.and(RestauranteSpecification.comNotaMinima(request.getNotaMinima()));
        spec = spec.and(RestauranteSpecification.comServicos(request.getServicos()));
        
        // --- CORREÇÃO AQUI ---
        // Se o 'diaSemana' (que é um Enum) não for nulo, converte-o para String.
        String diaSemanaString = null;
        if (request.getDiaSemana() != null) {
            diaSemanaString = request.getDiaSemana().toString(); // Converte (ex: DiaDaSemana.SEGUNDA -> "SEGUNDA")
        }
        
        // ANTES: spec = spec.and(RestauranteSpecification.comDiaSemanaDisponivel(request.getDiaSemana()));
        // DEPOIS: Passa a String (que pode ser nula ou "SEGUNDA")
        spec = spec.and(RestauranteSpecification.comDiaSemanaDisponivel(diaSemanaString));
        // --- FIM DA CORREÇÃO ---

        // --- EXECUÇÃO DA CONSULTA ÚNICA ---
        List<Restaurante> restaurantesFiltrados = restauranteRepository.findAll(spec);

        // --- MAPEAMENTO PARA A RESPOSTA FINAL ---
        return restaurantesFiltrados.stream()
            .map(ClienteHomeResponse::new)
            .collect(Collectors.toList());
    }
}