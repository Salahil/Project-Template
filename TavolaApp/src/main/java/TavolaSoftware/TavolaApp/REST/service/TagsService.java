package TavolaSoftware.TavolaApp.REST.service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import TavolaSoftware.TavolaApp.REST.model.Tags;
import TavolaSoftware.TavolaApp.REST.repository.TagsRepository;

@Service
public class TagsService {

    @Autowired
    private TagsRepository tagsRepository;

    @Transactional
    public Tags save(String nomeTag) {
        if (tagsRepository.existsByTag(nomeTag)) {
            return tagsRepository.findByTag(nomeTag).get();
        }
        
        Tags novaTag = new Tags(nomeTag);
        return tagsRepository.save(novaTag);
    }

    @Transactional
    public Set<Tags> saveAll(Set<String> nomesTags) {
        Set<Tags> tags = new HashSet<>();
        
        for (String nomeTag : nomesTags) {
            Tags tag = save(nomeTag);
            tags.add(tag);
        }
        
        return tags;
    }

    @Transactional(readOnly = true)
    public Tags findById(UUID id) {
        return tagsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag não encontrada com o ID: " + id));
    }

    @Transactional(readOnly = true)
    public Tags findByNome(String nome) {
        return tagsRepository.findByTag(nome)
                .orElseThrow(() -> new RuntimeException("Tag não encontrada com o nome: " + nome));
    }

    @Transactional(readOnly = true)
    public Set<Tags> findAll() {
        return new HashSet<>(tagsRepository.findAll());
    }

    @Transactional
    public void delete(UUID id) {
        if (!tagsRepository.existsById(id)) {
            throw new RuntimeException("Tag não encontrada com o ID: " + id);
        }
        tagsRepository.deleteById(id);
    }

    @Transactional
    public Tags update(UUID id, String novoNome) {
        Tags tag = findById(id);
        
        if (tagsRepository.existsByTag(novoNome) && !tag.getTag().equals(novoNome)) {
            throw new RuntimeException("Já existe uma tag com o nome: " + novoNome);
        }
        
        tag.setTag(novoNome);
        return tagsRepository.save(tag);
    }
} 