package TavolaSoftware.TavolaApp.tools;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.*;

public class ResponseExceptionHandler {

    private final List<String> mensagensErro = new ArrayList<>();

    // String obrigatória
    public void checkEmptyStrting(String nomeCampo, String valor) {
        if (valor == null || valor.isBlank()) {
            mensagensErro.add("O campo '" + nomeCampo + "' é obrigatório.");
        }
    }

    // Objeto genérico obrigatório (UUID, Endereco, etc)
    public void checkEmptyObject(String nomeCampo, Object valor) {
        if (valor == null) {
            mensagensErro.add("O campo '" + nomeCampo + "' é obrigatório.");
        }
    }

    // Número obrigatório (ex: valor > 0)
    public void checkMinimmumNumber(String nomeCampo, Number valor, double minimo) {
        if (valor == null || valor.doubleValue() <= minimo) {
            mensagensErro.add("O campo '" + nomeCampo + "' deve ser maior que " + minimo + ".");
        }
    }

    // Lista obrigatória
    public void checkEmptyList(String nomeCampo, List<?> lista) {
        if (lista == null || lista.isEmpty()) {
            mensagensErro.add("A lista '" + nomeCampo + "' não pode estar vazia.");
        }
    }

    // UUID obrigatório
    public void checkUUID(String nomeCampo, UUID valor) {
        if (valor == null) {
            mensagensErro.add("O campo '" + nomeCampo + "' é obrigatório.");
        }
    }

    // Condição genérica (quando quiser customizar a mensagem)
    public void checkCondition(String mensagem, boolean condicaoInvalida) {
        if (condicaoInvalida) {
            mensagensErro.add(mensagem);
        }
    }

    // Resultado
    public boolean errors() {
        return !mensagensErro.isEmpty();
    }

    public ResponseEntity<Object> generateResponse(HttpStatus status) {
        return new ResponseEntity<>(new ResponseErrors(status.value(), mensagensErro, LocalDateTime.now()), status);
    }

    // Estrutura do JSON de retorno
    // SIM, ISSO É UMA SUBCLASSE INTERNA!
    private static class ResponseErrors {
        private int status;
        private List<String> mensagens;
        private LocalDateTime timestamp;

        public ResponseErrors(int status, List<String> mensagens, LocalDateTime timestamp) {
            this.status = status;
            this.mensagens = mensagens;
            this.timestamp = timestamp;
        }

        public int getStatus() { return status; }
        public List<String> getMensagens() { return mensagens; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }
}
