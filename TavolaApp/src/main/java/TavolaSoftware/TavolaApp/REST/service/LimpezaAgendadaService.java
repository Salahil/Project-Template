// Em package TavolaSoftware.TavolaApp.REST.service;

package TavolaSoftware.TavolaApp.REST.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import TavolaSoftware.TavolaApp.REST.repository.CategoriaRepository;
import TavolaSoftware.TavolaApp.REST.repository.ServicoRepository;
import TavolaSoftware.TavolaApp.REST.repository.TagsRepository;

import java.util.List;
import TavolaSoftware.TavolaApp.REST.model.Categoria;
import TavolaSoftware.TavolaApp.REST.model.Servico;
import TavolaSoftware.TavolaApp.REST.model.Tags;

@Service
public class LimpezaAgendadaService {

    @Autowired
    private CategoriaRepository categoriaRepository;
    
    @Autowired
    private TagsRepository tagsRepository; // <<< INJETAR

    @Autowired
    private ServicoRepository servicoRepository; // <<< INJETAR
    
    /**
     * Limpa categorias órfãs (que não estão associadas a nenhum item de cardápio).
     * Roda todos os dias às 03:00 da manhã.
     * A expressão cron é: (segundo minuto hora dia-do-mês mês dia-da-semana)
     */
    @Transactional
    @Scheduled(cron = "0 0 3 * * ?")
    public void limparCategoriasOrfas() {
        System.out.println("EXECUTANDO TAREFA: Limpeza de Categorias Órfãs...");
        List<Categoria> categoriasOrfas = categoriaRepository.findCategoriasSemCardapio();
        
        if (!categoriasOrfas.isEmpty()) {
            System.out.println("Encontradas " + categoriasOrfas.size() + " categorias órfãs para remover.");
            categoriaRepository.deleteAll(categoriasOrfas);
            System.out.println("Categorias órfãs removidas com sucesso.");
        } else {
            System.out.println("Nenhuma categoria órfã encontrada.");
        }
    }
    
    @Transactional
    @Scheduled(cron = "0 5 3 * * ?") // Roda 5 minutos depois
    public void limparTagsOrfas() {
        System.out.println("EXECUTANDO TAREFA: Limpeza de Tags Órfãs...");
        List<Tags> tagsOrfas = tagsRepository.findTagsOrfas();
        
        if (!tagsOrfas.isEmpty()) {
            System.out.println("Encontradas " + tagsOrfas.size() + " tags órfãs para remover.");
            tagsRepository.deleteAll(tagsOrfas);
            System.out.println("Tags órfãs removidas com sucesso.");
        } else {
            System.out.println("Nenhuma tag órfã encontrada.");
        }
    }
    
    @Transactional
    @Scheduled(cron = "0 10 3 * * ?") // Roda 10 minutos depois
    public void limparServicosOrfos() {
        System.out.println("EXECUTANDO TAREFA: Limpeza de Serviços Órfãos...");
        List<Servico> servicosOrfos = servicoRepository.findServicosOrfos();
        
        if (!servicosOrfos.isEmpty()) {
            System.out.println("Encontrados " + servicosOrfos.size() + " serviços órfãos para remover.");
            servicoRepository.deleteAll(servicosOrfos);
            System.out.println("Serviços órfãos removidos com sucesso.");
        } else {
            System.out.println("Nenhum serviço órfão encontrado.");
        }
    }
}