package TavolaSoftware.TavolaApp.REST.service;

import TavolaSoftware.TavolaApp.REST.dto.requests.ClienteUpdateRequest;
import TavolaSoftware.TavolaApp.REST.dto.responses.ClienteHomeResponse;
import TavolaSoftware.TavolaApp.REST.model.Cliente;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.model.Usuario;
import TavolaSoftware.TavolaApp.REST.repository.AvaliacaoRepository;
import TavolaSoftware.TavolaApp.REST.repository.ClienteRepository;
import TavolaSoftware.TavolaApp.REST.repository.ReservaRepository;
import TavolaSoftware.TavolaApp.REST.repository.RestauranteRepository;
import TavolaSoftware.TavolaApp.REST.repository.UsuarioRepository;
import TavolaSoftware.TavolaApp.tools.UploadUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    @Autowired private ClienteRepository repo;
    @Autowired private RestauranteRepository repoRestaurante;
    @Autowired private AvaliacaoRepository avaliacaoRepository;
    @Autowired private ReservaRepository reservaRepository;
    @Autowired private UsuarioRepository repoUsuario;
    @Autowired private UploadUtils uplUtil;

    public Cliente save(Cliente client) { return repo.save(client); }
    public List<Cliente> findAll() { return repo.findAll(); }
    public Optional<Cliente> findById(UUID id) { return repo.findById(id); }
    public Optional<Cliente> findByEmail(String email) { return Optional.ofNullable(repo.findByUsuarioEmail(email)); }
    public void delete(UUID id) { repo.deleteById(id); }

    @Transactional
    public String toggleFavorito(String emailCliente, UUID restauranteId) {
        // Lógica sem alterações...
        Cliente cliente = repo.findByUsuarioEmail(emailCliente);
        if (cliente == null) throw new RuntimeException("Cliente não encontrado para email: " + emailCliente);
        if (!repoRestaurante.existsById(restauranteId)) throw new RuntimeException("Restaurante com ID " + restauranteId + " não encontrado.");
        List<UUID> favoritos = cliente.getFavoritos();
        String mensagem;
        if (favoritos.contains(restauranteId)) {
            favoritos.remove(restauranteId);
            mensagem = "Restaurante removido dos favoritos.";
        } else {
            favoritos.add(restauranteId);
            mensagem = "Restaurante adicionado aos favoritos.";
        }
        repo.save(cliente);
        return mensagem;
    }

    public List<UUID> getFavoritos(String emailCliente) {
        // Lógica sem alterações...
        Cliente cliente = repo.findByUsuarioEmail(emailCliente);
        if (cliente == null) throw new RuntimeException("Cliente não encontrado para email: " + emailCliente);
        return new ArrayList<>(cliente.getFavoritos());
    }

    @Transactional
    public Cliente updateFromRequest(String email, ClienteUpdateRequest request) {
        Cliente clienteExistente = findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado para atualização com email: " + email));
        Usuario usuarioParaAtualizar = clienteExistente.getUsuario();

        // Atualiza campos simples (sem alterações)
        if (request.getNome() != null && !request.getNome().isBlank()) usuarioParaAtualizar.setNome(request.getNome());
        if (request.getEndereco() != null) usuarioParaAtualizar.setEndereco(request.getEndereco());
        if (request.getTelefone() != null) usuarioParaAtualizar.setTelefone(request.getTelefone());
        if (request.getSenha() != null && !request.getSenha().isBlank()) usuarioParaAtualizar.setSenha(BCrypt.hashpw(request.getSenha(), BCrypt.gensalt()));

        try {
            // Atualiza Imagem de Perfil
            if (request.getImagemPerfilBase64() != null && uplUtil.isBase64Image(request.getImagemPerfilBase64())) {
                if (usuarioParaAtualizar.getImagem() != null) {
                    // <<< CORREÇÃO AQUI >>>
                    String urlAntiga = uplUtil.construirUrlRelativa("usuarios", usuarioParaAtualizar.getImagem());
                    uplUtil.deletarArquivoPeloCaminho(urlAntiga);
                }
                // <<< CORREÇÃO AQUI >>>
                String nomeArquivoPerfil = uplUtil.processUsuarioImagem(request.getImagemPerfilBase64());
                usuarioParaAtualizar.setImagem(nomeArquivoPerfil); // Salva SÓ o nome
            } else if (request.getImagemPerfilBase64() != null && request.getImagemPerfilBase64().isBlank()) {
                // Remove imagem se string vazia for enviada
                if (usuarioParaAtualizar.getImagem() != null) {
                    String urlAntiga = uplUtil.construirUrlRelativa("usuarios", usuarioParaAtualizar.getImagem());
                    uplUtil.deletarArquivoPeloCaminho(urlAntiga);
                }
                usuarioParaAtualizar.setImagem(null);
            }

            // Atualiza Imagem de Background
            if (request.getImagemBackgroundBase64() != null && uplUtil.isBase64Image(request.getImagemBackgroundBase64())) {
                if (usuarioParaAtualizar.getImagemPrincipal() != null) {
                     // <<< CORREÇÃO AQUI >>>
                    String urlAntigaBg = uplUtil.construirUrlRelativa("usuarios", usuarioParaAtualizar.getImagemPrincipal());
                    uplUtil.deletarArquivoPeloCaminho(urlAntigaBg);
                }
                // <<< CORREÇÃO AQUI >>>
                String nomeArquivoBg = uplUtil.processUsuarioImagem(request.getImagemBackgroundBase64());
                usuarioParaAtualizar.setImagemPrincipal(nomeArquivoBg); // Salva SÓ o nome
            } else if (request.getImagemBackgroundBase64() != null && request.getImagemBackgroundBase64().isBlank()) {
                // Remove imagem se string vazia for enviada
                 if (usuarioParaAtualizar.getImagemPrincipal() != null) {
                    String urlAntigaBg = uplUtil.construirUrlRelativa("usuarios", usuarioParaAtualizar.getImagemPrincipal());
                    uplUtil.deletarArquivoPeloCaminho(urlAntigaBg);
                }
                usuarioParaAtualizar.setImagemPrincipal(null);
            }
        } catch (IOException e) {
            throw new RuntimeException("Erro ao processar imagem: " + e.getMessage(), e);
        }

        // Salva o Usuario (que cascateia para Cliente via @MapsId, geralmente)
        // Se a cascata não estiver configurada ou for unidirecional, salvar o Cliente pode ser necessário.
        // Vamos salvar o usuario diretamente para garantir.
        repoUsuario.save(usuarioParaAtualizar);
        return clienteExistente; // Retorna o cliente (com o usuário atualizado)
    }

    @Transactional
    public void deleteByEmail(String email) {
        Cliente cliente = findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado com o email: " + email));
        UUID clienteId = cliente.getId();
        Usuario usuario = cliente.getUsuario();

        // Deleta dependências (sem alterações)
        avaliacaoRepository.deleteAllByClienteId(clienteId);
        reservaRepository.deleteAllByClienteId(clienteId);

        // Deleta Cliente e Usuário (sem alterações)
        repo.delete(cliente);
        if (usuario != null) {

            // Deleta arquivos individuais associados, se existirem
            if (usuario.getImagem() != null) {
                 String urlImagem = uplUtil.construirUrlRelativa("usuarios", usuario.getImagem());
                 uplUtil.deletarArquivoPeloCaminho(urlImagem);
            }
             if (usuario.getImagemPrincipal() != null) {
                 String urlBg = uplUtil.construirUrlRelativa("usuarios", usuario.getImagemPrincipal());
                 uplUtil.deletarArquivoPeloCaminho(urlBg);
            }

            repoUsuario.delete(usuario);
        }
    }

    @Transactional(readOnly = true)
    public List<ClienteHomeResponse> getFavoritosComDetalhes(String emailCliente) {
        // Lógica sem alterações...
        Cliente cliente = repo.findByUsuarioEmail(emailCliente);
        if (cliente == null) throw new RuntimeException("Cliente não encontrado para email: " + emailCliente);
        List<UUID> favoritosIds = cliente.getFavoritos();
        if (favoritosIds == null || favoritosIds.isEmpty()) return new ArrayList<>();
        List<Restaurante> restaurantesFavoritos = repoRestaurante.findAllById(favoritosIds);
        return restaurantesFavoritos.stream()
                .map(ClienteHomeResponse::new)
                .collect(Collectors.toList());
    }

    // <<< NOVOS MÉTODOS HELPER PARA RECONSTRUIR URLs PARA DTOs >>>
    public String getUrlImagemPerfil(Cliente cliente) {
        return (cliente.getUsuario() != null) ? uplUtil.construirUrlRelativa("usuarios", cliente.getUsuario().getImagem()) : null;
    }

    public String getUrlImagemBackground(Cliente cliente) {
         return (cliente.getUsuario() != null) ? uplUtil.construirUrlRelativa("usuarios", cliente.getUsuario().getImagemPrincipal()) : null;
    }
}