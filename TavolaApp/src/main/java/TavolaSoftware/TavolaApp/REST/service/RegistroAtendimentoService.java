package TavolaSoftware.TavolaApp.REST.service;

import TavolaSoftware.TavolaApp.REST.dto.responses.RegistroAtendimentoResponse;
import TavolaSoftware.TavolaApp.REST.repository.RegistroAtendimentoRepository;
import TavolaSoftware.TavolaApp.REST.security.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RegistroAtendimentoService {

    @Autowired
    private RegistroAtendimentoRepository registroRepository;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Extrai o ID do restaurante do token de segurança.
     */
    private UUID getRestauranteIdFromToken() {
        String token = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();
        Claims claims = jwtUtil.parseToken(token);
        // Assumindo que o token de Garçom ou Restaurante contém o 'restauranteId'
        return UUID.fromString(claims.get("restauranteId", String.class));
    }

    /**
     * Busca todo o histórico de atendimentos (getAll) para o restaurante logado.
     */
    @Transactional(readOnly = true)
    public List<RegistroAtendimentoResponse> getAllByRestaurante() {
        UUID restauranteId = getRestauranteIdFromToken();
        
        return registroRepository.findByRestauranteIdFetch(restauranteId).stream()
                .map(RegistroAtendimentoResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Busca um registro de atendimento (getById) específico.
     */
    @Transactional(readOnly = true)
    public RegistroAtendimentoResponse getById(UUID id) {
        UUID restauranteId = getRestauranteIdFromToken();

        return registroRepository.findByIdAndRestauranteIdFetch(id, restauranteId)
                .map(RegistroAtendimentoResponse::new)
                .orElseThrow(() -> new EntityNotFoundException("Registro de Atendimento não encontrado ou não pertence a este restaurante."));
    }
}