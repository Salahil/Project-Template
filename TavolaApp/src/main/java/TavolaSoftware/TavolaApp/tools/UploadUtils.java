package TavolaSoftware.TavolaApp.tools;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Component;

@Component
public class UploadUtils {

    // Define os diretórios base planos
    private static final String BASE_DIR = "upl";
    private static final Path USUARIOS_DIR = Paths.get(BASE_DIR, "usuarios");
    private static final Path RESTAURANTES_DIR = Paths.get(BASE_DIR, "restaurantes");
    private static final Path CARDAPIOS_DIR = Paths.get(BASE_DIR, "cardapios");
    private static final Path GARCONS_DIR = Paths.get(BASE_DIR, "garcons");

    // Verifica se é uma string Base64 de imagem (genérica)
    public boolean isBase64Image(String input) {
        if (input == null || input.trim().isEmpty()) {
            return false;
        }
        // Aceita qualquer 'data:image/...' ou o antigo 'data:principal/...' por segurança
        return (input.startsWith("data:image/") || input.startsWith("data:principal/"))
               && input.contains(";base64,");
    }

    /**
     * Processa a string Base64, salva o arquivo na pasta de destino e retorna SÓ o nome do arquivo.
     */
    private String processBase64(String base64StringComCabecalho, Path pastaDestino) throws IOException {
        // Remove o cabeçalho (data:image/jpeg;base64, ou data:principal/...)
        String base64Data = base64StringComCabecalho.substring(base64StringComCabecalho.indexOf(",") + 1);
        byte[] decodedBytes = Base64.getDecoder().decode(base64Data);

        // Garante que a pasta de destino exista
        if (!Files.exists(pastaDestino)) {
            Files.createDirectories(pastaDestino);
        }

        // Determina a extensão (default jpg, mas tenta pegar do cabeçalho se possível)
        String extensao = "jpg";
        if (base64StringComCabecalho.contains("data:image/png")) {
            extensao = "png";
        } else if (base64StringComCabecalho.contains("data:image/gif")) {
            extensao = "gif";
        } // Adicione outros tipos se precisar

        String nomeArquivo = UUID.randomUUID().toString() + "." + extensao;
        Path filePath = pastaDestino.resolve(nomeArquivo);

        try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
            fos.write(decodedBytes);
        }
        return nomeArquivo; // Retorna SÓ o nome do arquivo (uuid.ext)
    }

    /**
     * Processa uma lista de imagens (Base64 ou nomes de arquivo existentes) para a galeria do restaurante.
     * Retorna uma lista contendo as URLs RELATIVAS COMPLETAS.
     */
    public List<String> processRestauranteGaleria(List<String> imagensInput) throws IOException {
        List<String> urlsProcessadas = new ArrayList<>();

        for (String imagem : imagensInput) {
            if (isBase64Image(imagem)) {
                String nomeArquivo = processBase64(imagem, RESTAURANTES_DIR);
                
                String url = construirUrlRelativa("restaurantes", nomeArquivo);
                if (!url.startsWith("/")) {url = "/" + url;}
                urlsProcessadas.add(url);
                
            } else if (imagem != null && !imagem.isBlank() && !imagem.startsWith("data:")) {
                String nomeArquivo = findNameByURL(imagem);

                String url = construirUrlRelativa("restaurantes", nomeArquivo);
                if (!url.startsWith("/")) {url = "/" + url;}
                urlsProcessadas.add(url);
            }
            // Ignora strings vazias ou nulas
        }
        return urlsProcessadas; // Retorna a lista de URLs
    }

    /**
     * Processa uma imagem Base64 para perfil ou background de usuário.
     * Retorna a URL RELATIVA COMPLETA (ex: upl/usuarios/uuid.jpg).
     */
    public String processUsuarioImagem(String imagemBase64) throws IOException {
        if (!isBase64Image(imagemBase64)) {
            throw new IOException("A string fornecida não é uma imagem Base64 válida.");
        }
        // Salva na pasta de usuários
        String nomeArquivo = processBase64(imagemBase64, USUARIOS_DIR);
        // ATUALIZAÇÃO: Retorna a URL completa
        
        String url = construirUrlRelativa("usuarios", nomeArquivo);
        if (!url.startsWith("/")) {url = "/" + url;}
        return url;
    }

    /**
     * Processa uma imagem Base64 para item de cardápio.
     * Retorna a URL RELATIVA COMPLETA (ex: upl/cardapios/uuid.jpg).
     */
    public String processCardapioImagem(String imagemBase64) throws IOException {
        if (!isBase64Image(imagemBase64)) {
            throw new IOException("A string fornecida não é uma imagem Base64 válida.");
        }
        // Salva na pasta de cardápios
        String nomeArquivo = processBase64(imagemBase64, CARDAPIOS_DIR);
        // ATUALIZAÇÃO: Retorna a URL completa
        
        String url = construirUrlRelativa("cardapios", nomeArquivo);
        if (!url.startsWith("/")) {url = "/"  + url;} // garante pra caralho que ele vá ter uma / antes de upl
        return url;
    }
    
    /**
     * Processa uma imagem (Base64 ou URL antiga) para a imagem principal do restaurante.
     * Retorna a URL RELATIVA COMPLETA (ex: upl/restaurantes/uuid.jpg).
     */
    public String processRestauranteImagemPrincipal(String imagemInput) throws IOException {
        if (isBase64Image(imagemInput)) {
            String nomeArquivo = processBase64(imagemInput, RESTAURANTES_DIR);
            // ATUALIZAÇÃO: Retorna a URL completa
            
            String url = construirUrlRelativa("restaurantes", nomeArquivo);     
            if (!url.startsWith("/")) {url = "/" + url;}
            return url;
            
        } else if (imagemInput != null && !imagemInput.isBlank() && !imagemInput.startsWith("data:")) {
            // ATUALIZAÇÃO: Reconstrói a URL completa a partir do nome
            String nomeArquivo = findNameByURL(imagemInput); 
            
            String url = construirUrlRelativa("restaurantes", nomeArquivo);
            if (!url.startsWith("/")) {url = "/" + url;}
            return url;
        }
        
        if (imagemInput == null || imagemInput.isBlank()) {
            return null;
        }
        
        throw new IOException("A string fornecida parece ser Base64 mas é inválida.");
    }
    
    /**
     * Processa uma imagem (Base64 ou URL antiga) para o perfil do garçom.
     * Retorna a URL RELATIVA COMPLETA (ex: upl/garcons/uuid.jpg).
     */
    public String processGarcomImagem(String imagemInput) throws IOException {
        if (isBase64Image(imagemInput)) {
            String nomeArquivo = processBase64(imagemInput, GARCONS_DIR);
            
            String url = construirUrlRelativa("garcons", nomeArquivo);
            if (!url.startsWith("/")) {url = "/" + url;}
            return url;
            
        } else if (imagemInput != null && !imagemInput.isBlank() && !imagemInput.startsWith("data:")) {
            String nomeArquivo = findNameByURL(imagemInput);

            String url = construirUrlRelativa("garcons", nomeArquivo); 
            if (!url.startsWith("/")) {url = "/" + url;}
            return url; 
        }
        
        // Se for nula ou vazia
        if (imagemInput == null || imagemInput.isBlank()) {
            return null;
        }
        
        // Se começar com "data:" mas não for válida
        throw new IOException("A string fornecida parece ser Base64 mas é inválida.");
    }

    /**
     * Reconstrói a URL relativa completa a partir do tipo e nome do arquivo.
     * ATUALIZADO: Retorna upl/usuarios/uuid-arquivo.jpg (sem barra inicial)
     */
    public String construirUrlRelativa(String tipo, String nomeArquivo) {
        if (nomeArquivo == null || nomeArquivo.isBlank()) {
            return null;
        }
        // Se já for a URL relativa correta (sem a barra inicial), retorna ela mesma
        if (nomeArquivo.startsWith("/" + BASE_DIR + "/")) { // (Verifica se já começa com /upl/)
            return nomeArquivo;
       }

        if (nomeArquivo.startsWith(BASE_DIR + "/")) { // (Verifica se começa com upl/)
            return "/" + nomeArquivo; // Adiciona a barra
        }
        
        String tipoUrl = tipo.toLowerCase();
        if (tipoUrl.equals("garcom")) {tipoUrl = "garcons";} else if (!tipoUrl.endsWith("s")) {tipoUrl += "s";}
        
        return "/" + BASE_DIR + "/" + tipoUrl + "/" + nomeArquivo;
    }

    /**
     * Deleta um arquivo específico pela sua URL relativa (ex: upl/usuarios/uuid.jpg).
     */
    public void deletarArquivoPeloCaminho(String caminhoRelativo) {
        if (caminhoRelativo == null || caminhoRelativo.isBlank()) {
            return;
        }
        
        // Adiciona a barra inicial se estiver faltando, para compatibilidade com o split
        String caminhoParaSplit = caminhoRelativo;
        if (!caminhoRelativo.startsWith("/")) {
             caminhoParaSplit = "/" + caminhoRelativo;
        }

        if (!caminhoParaSplit.startsWith("/" + BASE_DIR + "/")) {
            return; // Ignora caminhos inválidos
        }
        
        try {
            // Extrai o tipo e o nome do arquivo da URL
            // Ex: /upl/usuarios/uuid.jpg -> ["", "upl", "usuarios", "uuid.jpg"]
            String[] parts = caminhoParaSplit.split("/");
            if (parts.length < 4) return; // Formato inválido

            String tipo = parts[2]; // "usuarios", "restaurantes", "cardapios"
            String nomeArquivo = parts[3];

            Path pastaFisica;
            switch (tipo) {
                case "usuarios": pastaFisica = USUARIOS_DIR; break;
                case "restaurantes": pastaFisica = RESTAURANTES_DIR; break;
                case "cardapios": pastaFisica = CARDAPIOS_DIR; break;
                case "garcons": pastaFisica = GARCONS_DIR; break;
                default:
                    System.err.println("Tipo desconhecido ao tentar deletar arquivo: " + tipo);
                    return;
            }

            Path pathArquivo = pastaFisica.resolve(nomeArquivo);
            Files.deleteIfExists(pathArquivo);
            System.out.println("Arquivo deletado (se existia): " + pathArquivo.toString());

        } catch (IOException e) {
            System.err.println("Erro ao tentar deletar o arquivo " + caminhoRelativo + ": " + e.getMessage());
        }
    }

    /**
     * Extrai apenas o nome do arquivo de uma URL completa ou parcial.
     */
    public String findNameByURL(String url) {
        if (url == null || url.isEmpty()) {
            return null;
        }
        // Se já não contém '/', assume que é só o nome
        if (!url.contains("/")) {
            return url;
        }
        String[] parts = url.split("/");
        return parts.length > 0 ? parts[parts.length - 1] : null;
    }
}