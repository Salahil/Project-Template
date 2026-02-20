package TavolaSoftware.TavolaApp.REST.dto.requests;

// Usamos as anotações do Jakarta Validation para garantir que o nome não seja nulo ou vazio.
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AmbienteRequest {

    @NotBlank(message = "O nome do ambiente não pode ser vazio.")
    @Size(max = 100, message = "O nome do ambiente não pode exceder 100 caracteres.")
    private String nome;

    // Getters e Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}