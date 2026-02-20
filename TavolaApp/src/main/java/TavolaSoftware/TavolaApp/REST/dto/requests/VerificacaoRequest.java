package TavolaSoftware.TavolaApp.REST.dto.requests;

import java.util.UUID;

public class VerificacaoRequest {
    private UUID idVerificacao; // <<< MUDANÇA PRINCIPAL
    private String codigo;
    private boolean mantenhaMeConectado;

    // Getters e Setters
    public UUID getIdVerificacao() { return idVerificacao; }
    public void setIdVerificacao(UUID idVerificacao) { this.idVerificacao = idVerificacao; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public boolean isMantenhaMeConectado() { return mantenhaMeConectado; }
    public void setMantenhaMeConectado(boolean mantenhaMeConectado) { this.mantenhaMeConectado = mantenhaMeConectado; }
}