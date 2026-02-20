// Crie em /tools/OcupacaoMesaStatus.java
package TavolaSoftware.TavolaApp.tools;

public enum OcupacaoMesaStatus {
    PENDENTE, // O cliente iniciou, aguardando aprovação do garçom
    ATIVA,      // O garçom aprovou, o cliente pode fazer pedidos
    FINALIZADA  // A conta foi fechada
}