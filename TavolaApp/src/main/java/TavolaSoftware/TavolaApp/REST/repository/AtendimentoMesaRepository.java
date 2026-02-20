package TavolaSoftware.TavolaApp.REST.repository;

import TavolaSoftware.TavolaApp.REST.model.AtendimentoMesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AtendimentoMesaRepository extends JpaRepository<AtendimentoMesa, UUID> {

    /**
     * Encontra o atendimento ATIVO para uma mesa específica.
     * Usa JOIN FETCH para trazer os garçons associados.
     */
    @Query("SELECT a FROM AtendimentoMesa a LEFT JOIN FETCH a.garcons WHERE a.mesa.id = :mesaId AND a.ativo = true")
    Optional<AtendimentoMesa> findAtendimentoAtivoByMesaId(@Param("mesaId") UUID mesaId);
    
    /**
     * Busca Atendimentos para o Dashboard.
     * Regra: Traz o atendimento se:
     * 1. Pertence a uma das mesas da lista.
     * 2. E satisfaz UMA das condições:
     * a) Começou na data solicitada (Histórico do dia).
     * b) OU está ATIVO (garante que mesas ocupadas apareçam sempre, independente da data de início).
     */
    @Query("SELECT a FROM AtendimentoMesa a " +
           "LEFT JOIN FETCH a.garcons " + // Otimização: Traz logo os garçons para evitar N+1 no dashboard
           "WHERE a.mesa.id IN :mesaIds " +
           "AND (" +
           "   CAST(a.horaInicio AS DATE) = :data " +
           "   OR " +
           "   a.ativo = true " + 
           ")")
    List<AtendimentoMesa> findAtendimentosByMesaIdsAndData(
            @Param("mesaIds") List<UUID> mesaIds, 
            @Param("data") LocalDate data
    );

    List<AtendimentoMesa> findByMesaIdIn(List<UUID> mesaIds);
}