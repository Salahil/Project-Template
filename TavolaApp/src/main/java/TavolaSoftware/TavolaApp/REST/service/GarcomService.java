package TavolaSoftware.TavolaApp.REST.service;

import TavolaSoftware.TavolaApp.REST.dto.requests.GarcomRequest;
import TavolaSoftware.TavolaApp.REST.model.Garcom;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.repository.GarcomRepository;
import TavolaSoftware.TavolaApp.REST.repository.RestauranteRepository;
import TavolaSoftware.TavolaApp.tools.UploadUtils; //

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException; //
import java.util.List;
import java.util.UUID;

@Service
public class GarcomService {

    @Autowired private GarcomRepository garcomRepository;
    @Autowired private RestauranteRepository restauranteRepository;
    @Autowired private BCryptPasswordEncoder passwordEncoder;
    @Autowired private UploadUtils uplUtil; //

    @Transactional
    public Garcom createGarcom(GarcomRequest request, UUID restauranteId) {
        // ... (Seu método createGarcom está PERFEITO, não mexer)
        //
        
    	System.out.println("[GarçomSERV] " + "Serviço Requisitado");
        Restaurante restaurante = restauranteRepository.findById(restauranteId)
                .orElseThrow(() -> new RuntimeException("Restaurante não encontrado."));

        String novoCodigo = gerarCodigoUnico(restauranteId);
        System.out.println("[GarçomSERV] " + "código gerado como: " + novoCodigo);

        Garcom garcom = new Garcom();
        garcom.setNome(request.getNome());
        garcom.setCodigoIdentidade(novoCodigo);
        garcom.setSenha(passwordEncoder.encode(request.getSenha()));
        garcom.setRestaurante(restaurante);
        
        // Esta lógica usa o UploadUtils (Base64) perfeitamente
        if (request.getImagem() != null && !request.getImagem().isBlank()) {
            try {
                // uplUtil.processGarcomImagem(String)
                String nomeImagem = uplUtil.processGarcomImagem(request.getImagem()); 
                garcom.setImagem(nomeImagem); 
            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar imagem do garçom: " + e.getMessage(), e);
            }
        }
        
        System.out.println("[GarçomSERV] " + "objeto de garçom populado");

        return garcomRepository.save(garcom);
    }
    
    private String gerarCodigoUnico(UUID restauranteId) {
        // ... (Seu método gerarCodigoUnico está PERFEITO, não mexer)
        //
        String codigo;
        do {
            int numero = 10000000 + new java.util.Random().nextInt(90000000); 
            String numeroStr = String.valueOf(numero);
            codigo = numeroStr.substring(0, 4) + "-" + numeroStr.substring(4);
        } while (garcomRepository.findByRestauranteIdAndCodigoIdentidade(restauranteId, codigo).isPresent());
        return codigo;
    }

    @Transactional(readOnly = true)
    public List<Garcom> findAllByRestaurante(UUID restauranteId) {
        // ... (Seu método findAllByRestaurante está PERFEITO)
        //
    	List<Garcom> garcons = garcomRepository.findAllByRestauranteId(restauranteId);
        garcons.forEach(garcom -> {
            if (garcom.getImagem() != null) {
                // O construirUrlRelativa já trata "garcom" -> "garcons"
                garcom.setImagem(uplUtil.construirUrlRelativa("garcom", garcom.getImagem()));
            }
        });
        return garcons;
    }

    @Transactional
    public Garcom updateGarcom(UUID garcomId, GarcomRequest request, UUID restauranteId) {
        //
        Garcom garcom = garcomRepository.findById(garcomId)
                .orElseThrow(() -> new RuntimeException("Garçom não encontrado."));

        if (!garcom.getRestaurante().getId().equals(restauranteId)) {
            throw new SecurityException("Acesso negado. O garçom não pertence a este restaurante.");
        }

        if (request.getNome() != null && !request.getNome().isEmpty()) {
            garcom.setNome(request.getNome());
        }
        if (request.getSenha() != null && !request.getSenha().isEmpty()) {
            garcom.setSenha(passwordEncoder.encode(request.getSenha()));
        }
        
        // --- INÍCIO DA "GULOSEIMA" (LÓGICA CORRIGIDA) ---
        
        // O request.getImagem() pode ser:
        // 1. null: O usuário não quer mexer na imagem.
        // 2. String Base64: O usuário quer ATUALIZAR a imagem.
        // 3. String Vazia/Branca: O usuário quer REMOVER a imagem.
        // 4. Uma URL antiga: O usuário não mexeu (o frontend mandou de volta).
        
        String imagemInput = request.getImagem();
        
        // Pega o NOME do arquivo antigo (ex: "uuid.png")
        String nomeArquivoAntigo = garcom.getImagem(); // (lógica de findNameByURL)

        if (imagemInput == null) {
            // Caso 1: Não fazer nada, manter a imagem antiga.
            // (garcom.setImagem(nomeArquivoAntigo) -> já está lá)
        
        } else if (uplUtil.isBase64Image(imagemInput)) { //
            // Caso 2: Nova imagem Base64. Processar e deletar a antiga.
            try {
                // Salva a nova imagem e obtém o novo nome
                String nomeNovoArquivo = uplUtil.processGarcomImagem(imagemInput); 
                garcom.setImagem(nomeNovoArquivo); // Define o novo nome

                // Se tinha um arquivo antigo E ele é diferente do novo, deleta o antigo
                if (nomeArquivoAntigo != null && !nomeArquivoAntigo.equals(nomeNovoArquivo)) {
                    String caminhoAntigo = uplUtil.construirUrlRelativa("garcons", nomeArquivoAntigo); //
                    uplUtil.deletarArquivoPeloCaminho(caminhoAntigo); //
                }
                
            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar nova imagem do garçom: " + e.getMessage(), e);
            }
        
        } else if (imagemInput.isBlank()) {
            // Caso 3: String vazia. O usuário quer REMOVER a imagem.
            garcom.setImagem(null); // Remove do banco
            
            // Deleta o arquivo antigo se ele existia
            if (nomeArquivoAntigo != null) {
                String caminhoAntigo = uplUtil.construirUrlRelativa("garcons", nomeArquivoAntigo);
                uplUtil.deletarArquivoPeloCaminho(caminhoAntigo);
            }
            
        } else {
            // Caso 4: Não é Base64, não é nula, não é branca. 
            // Assume que é a URL antiga (só o nome do arquivo) que o front mandou de volta.
            // Apenas garante que estamos salvando só o nome, não a URL inteira.
            garcom.setImagem(uplUtil.findNameByURL(imagemInput)); //
        }
        
        // --- FIM DA "GULOSEIMA" ---
        
        return garcomRepository.save(garcom);
    }
    
    @Transactional
    public void deleteGarcom(UUID garcomId, UUID restauranteId) {
        //
        Garcom garcom = garcomRepository.findById(garcomId)
                .orElseThrow(() -> new RuntimeException("Garçom não encontrado."));

        if (!garcom.getRestaurante().getId().equals(restauranteId)) {
            throw new SecurityException("Acesso negado. O garçom não pertence a este restaurante.");
        }
        
        // --- LÓGICA DE DELETE DE ARQUIVO (Correta) ---
        String nomeImagem = garcom.getImagem(); // Pega só o nome
        // --- FIM DA LÓGICA ---
        
        garcomRepository.delete(garcom);
        
        // --- LÓGICA DE DELETE DE ARQUIVO (Continuação) ---
        if (nomeImagem != null && !nomeImagem.isBlank()) {
            // O construirUrlRelativa já trata "garcom" -> "garcons"
            String urlImagem = uplUtil.construirUrlRelativa("garcons", nomeImagem);
            uplUtil.deletarArquivoPeloCaminho(urlImagem); //
        }
        // --- FIM DA LÓGICA ---
    }
}