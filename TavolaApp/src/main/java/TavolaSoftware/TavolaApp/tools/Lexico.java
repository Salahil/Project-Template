// Substitua o conteúdo da sua classe TavolaSoftware.TavolaApp.tools.Lexico.java

package TavolaSoftware.TavolaApp.tools;

import com.google.cloud.vertexai.VertexAI;
import com.google.cloud.vertexai.api.GenerateContentResponse;
import com.google.cloud.vertexai.generativeai.GenerativeModel;
import com.google.cloud.vertexai.generativeai.ResponseHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Lexico {

    // Injeta a chave de API do seu arquivo application.properties
    @Value("${google.api.key}")
    private String apiKey;

    private GenerativeModel model;

    /**
     * Analisa o sentimento de um comentário usando a API do Gemini.
     * @param comentario O texto a ser analisado.
     * @return "POSITIVO", "NEGATIVO", "INADEQUADO" ou "NEUTRO".
     */
    public String analisarComentario(String comentario) {
        if (comentario == null || comentario.isBlank()) {
            return "NEUTRO";
        }

        // Usamos um bloco 'try-with-resources' para garantir que os recursos sejam fechados
        try (VertexAI vertexAi = new VertexAI("tavola-app", apiKey)) {
            
            // Define qual modelo Gemini queremos usar
            this.model = new GenerativeModel("gemini-1.5-flash-001", vertexAi);

            // <<< A MÁGICA ESTÁ AQUI: O PROMPT >>>
            // Criamos a instrução exata que a IA deve seguir.
            String prompt = String.format(
                "Analise o sentimento do seguinte comentário de um cliente de restaurante e " +
                "classifique-o estritamente como POSITIVO, NEGATIVO, NEUTRO ou INADEQUADO. " +
                "Responda com apenas uma dessas quatro palavras. Comentário: \"%s\"", 
                comentario
            );

            // Envia o prompt para a API
            GenerateContentResponse response = this.model.generateContent(prompt);
            
            // Extrai e limpa a resposta de texto
            String resultado = ResponseHandler.getText(response).trim();

            // Garante que a resposta seja uma das esperadas
            if (resultado.equalsIgnoreCase("POSITIVO") || resultado.equalsIgnoreCase("NEGATIVO") || 
                resultado.equalsIgnoreCase("NEUTRO") || resultado.equalsIgnoreCase("INADEQUADO")) {
                return resultado.toUpperCase();
            } else {
                // Se a IA responder algo inesperado, classificamos como NEUTRO por segurança
                return "NEUTRO";
            }

        } catch (Exception e) {
            System.err.println("Erro ao chamar a API do Gemini: " + e.getMessage());
            // Em caso de falha na API, retornamos NEUTRO para não quebrar o fluxo
            return "NEUTRO";
        }
    }
}