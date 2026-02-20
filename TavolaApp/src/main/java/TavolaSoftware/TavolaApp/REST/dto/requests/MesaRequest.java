package TavolaSoftware.TavolaApp.REST.dto.requests;

public class MesaRequest {
    private String nome;
    private String tipo;
    private int capacidade;
    private boolean vip;

    // Getters
    public String getNome() { return nome; }
    public String getTipo() { return tipo; }
    public int getCapacidade() { return capacidade; }
    public boolean isVip() { return vip; }

    // --- SETTERS ADICIONADOS ---
    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public void setCapacidade(int capacidade) {
        this.capacidade = capacidade;
    }

    public void setVip(boolean vip) {
        this.vip = vip;
    }
}