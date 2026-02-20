package TavolaSoftware.TavolaApp.REST.dto.requests;

public class StatusUpdateRequest {

    private String novoStatus;
    
    // <<< RENOMEADO >>>
    private String nomeCliente; // Era nomeClienteOcasional

    // Getters e Setters
    public String getNovoStatus() {
        return novoStatus;
    }
    public void setNovoStatus(String novoStatus) {
        this.novoStatus = novoStatus;
    }
    // <<< RENOMEADO >>>
    public String getNomeCliente() { // Era getNomeClienteOcasional
        return nomeCliente;
    }
    // <<< RENOMEADO >>>
    public void setNomeCliente(String nomeCliente) { // Era setNomeClienteOcasional
        this.nomeCliente = nomeCliente;
    }
}