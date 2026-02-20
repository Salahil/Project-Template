package TavolaSoftware.TavolaApp.REST.service;

import TavolaSoftware.TavolaApp.REST.model.Cardapio;
import TavolaSoftware.TavolaApp.REST.model.Categoria;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.model.Tags;
import TavolaSoftware.TavolaApp.REST.repository.CardapioRepository;
import TavolaSoftware.TavolaApp.tools.UploadUtils;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CardapioService {

    @Autowired private CategoriaService categoriaService;
    @Autowired private TagsService tagsService;
    @Autowired private CardapioRepository repo;
    @Autowired private UploadUtils uplUtil;

    public List<Cardapio> findAll() { return repo.findAll(); }
    public Optional<Cardapio> findById(UUID id) { return repo.findById(id); }
    public List<Cardapio> findByRestauranteId(UUID restauranteId) { return repo.findByRestauranteId(restauranteId); }

    @Transactional
    public Cardapio save(Cardapio cardapio, Restaurante restaurante) {
        cardapio.setRestaurante(restaurante);

        // Lógica de Categoria e Tags (sem alterações)
        if (cardapio.getCategoria() != null && cardapio.getCategoria().getNome() != null) {
            Categoria categoriaGerenciada = categoriaService.saveIfNotExists(cardapio.getCategoria().getNome(), restaurante);
            cardapio.setCategoria(categoriaGerenciada);
        } else {
            throw new IllegalArgumentException("A categoria é obrigatória para criar um item no cardápio.");
        }
        if (cardapio.getTags() != null && !cardapio.getTags().isEmpty()) {
            Set<String> nomesTags = cardapio.getTags().stream().map(Tags::getTag).collect(Collectors.toSet());
            Set<Tags> tagsGerenciadas = tagsService.saveAll(nomesTags);
            cardapio.setTags(tagsGerenciadas);
        }

        // Processa a imagem (Base64) e salva SÓ o filename
        if (cardapio.getImagem() != null && uplUtil.isBase64Image(cardapio.getImagem())) {
            try {
                // `processCardapioImagem` retorna a URL completa
                String urlCompleta = uplUtil.processCardapioImagem(cardapio.getImagem());
                
                // ANTES: cardapio.setImagem(nomeArquivo); // Salva SÓ o nome do arquivo
                cardapio.setImagem(urlCompleta); // DEPOIS: Salva a URL completa
                
            } catch (IOException e) {
                throw new RuntimeException("Erro ao salvar imagem de cardápio", e);
            }
        } else {
            // Se não for Base64, garante que salvamos null ou apenas o nome do arquivo, se já existir
            cardapio.setImagem(uplUtil.findNameByURL(cardapio.getImagem()));
        }

        return repo.save(cardapio);
    }
    
    public List<Cardapio> findAllByDisponivel(UUID restauranteId) {
        return repo.findAllDisponiveisByRestaurante(restauranteId);
    }

    @Transactional // Adicionado Transactional para garantir a deleção
    public void deleteById(UUID id) {
        Optional<Cardapio> cardapioOpt = repo.findById(id);
        if (cardapioOpt.isPresent()) {
            Cardapio cardapio = cardapioOpt.get();
            // Deleta o arquivo físico SE existir um nome de arquivo salvo
            if (cardapio.getImagem() != null && !cardapio.getImagem().isBlank()) {
                // <<< CORREÇÃO AQUI >>>
                String urlCompleta = uplUtil.construirUrlRelativa("cardapios", cardapio.getImagem());
                uplUtil.deletarArquivoPeloCaminho(urlCompleta);
            }
            // Remove a entidade do banco
            repo.deleteById(id);
        }
        // Se não encontrou, não faz nada
    }

    @Transactional
    public Cardapio update(UUID cardapioId, Cardapio dadosParaAtualizar, Restaurante restauranteDono) {
        Cardapio cardapioExistente = repo.findById(cardapioId)
            .orElseThrow(() -> new RuntimeException("Item de cardápio não encontrado com o ID: " + cardapioId));

        if (!cardapioExistente.getRestaurante().getId().equals(restauranteDono.getId())) {
            throw new SecurityException("Acesso negado. Você não tem permissão para alterar este item do cardápio.");
        }

        // Lógica de atualização de dados (sem alterações)
        if (dadosParaAtualizar.getNome() != null && !dadosParaAtualizar.getNome().isBlank()) cardapioExistente.setNome(dadosParaAtualizar.getNome());
        if (dadosParaAtualizar.getDescricao() != null) cardapioExistente.setDescricao(dadosParaAtualizar.getDescricao());
        if (dadosParaAtualizar.getPreco() != 0.0 && dadosParaAtualizar.getPreco() >= 0) cardapioExistente.setPreco(dadosParaAtualizar.getPreco()); // Permitir preço 0?
        cardapioExistente.setDisponivel(dadosParaAtualizar.getDisponivel());
        if (dadosParaAtualizar.getCategoria() != null && dadosParaAtualizar.getCategoria().getNome() != null) {
            Categoria novaCategoria = categoriaService.saveIfNotExists(dadosParaAtualizar.getCategoria().getNome(), restauranteDono);
            cardapioExistente.setCategoria(novaCategoria);
        }
        if (dadosParaAtualizar.getTags() != null) {
            Set<String> nomesTags = dadosParaAtualizar.getTags().stream().map(Tags::getTag).collect(Collectors.toSet());
            Set<Tags> novasTags = tagsService.saveAll(nomesTags);
            cardapioExistente.setTags(novasTags);
        }

        // Atualiza a imagem (se enviada como Base64)
        if (dadosParaAtualizar.getImagem() != null && uplUtil.isBase64Image(dadosParaAtualizar.getImagem())) {
            try {
                if (cardapioExistente.getImagem() != null && !cardapioExistente.getImagem().isBlank()) {
                    // Está correto, pois o BD (idealmente) tem a URL
                    String urlAntiga = cardapioExistente.getImagem();
                    uplUtil.deletarArquivoPeloCaminho(urlAntiga);
                }

                // `processCardapioImagem` retorna a URL completa
                String urlNovaCompleta = uplUtil.processCardapioImagem(dadosParaAtualizar.getImagem());
                
                // ANTES: cardapioExistente.setImagem(nomeNovoArquivo); // Salva só o nome
                cardapioExistente.setImagem(urlNovaCompleta); // DEPOIS: Salva a URL completa

            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar a nova imagem do cardápio: " + e.getMessage());
            }
        } else if (dadosParaAtualizar.getImagem() != null && dadosParaAtualizar.getImagem().isBlank()) {
            // Se enviou string vazia, remove a imagem existente
             if (cardapioExistente.getImagem() != null && !cardapioExistente.getImagem().isBlank()) {
                String urlAntiga = uplUtil.construirUrlRelativa("cardapios", cardapioExistente.getImagem());
                uplUtil.deletarArquivoPeloCaminho(urlAntiga);
            }
            cardapioExistente.setImagem(null);
        }
        // Se a imagem no DTO for null ou uma URL/nome existente, não faz nada com o arquivo

        return repo.save(cardapioExistente);
    }

    public Optional<Cardapio> findByNomeAndRestauranteId(String nome, UUID restauranteId) {
        return repo.findByNomeAndRestauranteId(nome, restauranteId);
    }

    // <<< NOVO MÉTODO HELPER PARA RECONSTRUIR URL PARA DTOs >>>
    public String getUrlImagemCardapio(Cardapio cardapio) {
        return uplUtil.construirUrlRelativa("cardapios", cardapio.getImagem());
    }
}