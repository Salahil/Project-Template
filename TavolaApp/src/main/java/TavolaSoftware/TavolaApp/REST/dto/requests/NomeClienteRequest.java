package TavolaSoftware.TavolaApp.REST.dto.requests;

/**
 * DTO para definir ou atualizar o nome do cliente (não cadastrado)
 * associado a um atendimento de mesa ativo.
 */
// <<< CLASSE RENOMEADA >>> (Era ClienteOcasionalRequest)
public class NomeClienteRequest {
    
    // <<< CAMPO RENOMEADO >>>
    private String nomeCliente; // Era nomeClienteOcasional

    // Getters e Setters
    // <<< RENOMEADO >>>
    public String getNomeCliente() { // Era getNomeClienteOcasional
        return nomeCliente;
    }
    // <<< RENOMEADO >>>
    public void setNomeCliente(String nomeCliente) { // Era setNomeClienteOcasional
        this.nomeCliente = nomeCliente;
    }
}