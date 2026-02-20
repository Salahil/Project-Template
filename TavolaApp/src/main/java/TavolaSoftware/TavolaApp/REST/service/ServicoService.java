package TavolaSoftware.TavolaApp.REST.service;

import TavolaSoftware.TavolaApp.REST.model.Servico; // Importar Servico
import TavolaSoftware.TavolaApp.REST.repository.ServicoRepository; // Importar ServicoRepository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.Optional; // Importar Optional

@Service
public class ServicoService {

    @Autowired
    private ServicoRepository servicoRepository; // Renomeado para servicoRepository

    @Transactional
    public Servico save(String nomeServico) {
        Optional<Servico> existingServico = servicoRepository.findByNome(nomeServico);
        if (existingServico.isPresent()) {
            return existingServico.get(); // Retorna o serviço existente se já houver um com o mesmo nome
        }

        Servico novoServico = new Servico(nomeServico);
        return servicoRepository.save(novoServico);
    }

    @Transactional
    public Set<Servico> saveAll(Set<String> nomesServicos) {
        Set<Servico> servicos = new HashSet<>();
        for (String nomeServico : nomesServicos) {
            // Pode adicionar uma descrição padrão ou requerer DTOs para descrições
            Servico servico = save(nomeServico); // Descrição vazia por padrão
            servicos.add(servico);
        }
        return servicos;
    }

    @Transactional(readOnly = true)
    public Optional<Servico> findById(UUID id) {
        return servicoRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Servico> findByNome(String nome) {
        return servicoRepository.findByNome(nome);
    }

    @Transactional(readOnly = true)
    public Set<Servico> findAll() {
        return new HashSet<>(servicoRepository.findAll());
    }

    @Transactional
    public void delete(UUID id) {
        if (!servicoRepository.existsById(id)) {
            throw new RuntimeException("Serviço não encontrado com o ID: " + id);
        }
        servicoRepository.deleteById(id);
    }

    @Transactional
    public Servico update(UUID id, String novoNome, String novaDescricao) {
        Servico servico = findById(id)
                          .orElseThrow(() -> new RuntimeException("Serviço não encontrado com o ID: " + id));

        if (servicoRepository.existsByNome(novoNome) && !servico.getNome().equals(novoNome)) {
            throw new IllegalArgumentException("Já existe um serviço com o nome: " + novoNome);
        }

        servico.setNome(novoNome);
        return servicoRepository.save(servico);
    }
    
    // Método para obter ou criar um serviço, útil ao atribuir a restaurantes
    @Transactional
    public Servico getOrCreateServico(String nomeServico) {
        return servicoRepository.findByNome(nomeServico)
                .orElseGet(() -> {
                    Servico newServico = new Servico(nomeServico);
                    return servicoRepository.save(newServico);
                });
    }
}