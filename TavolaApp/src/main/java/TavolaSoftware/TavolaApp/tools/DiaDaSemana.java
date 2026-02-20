package TavolaSoftware.TavolaApp.tools;

// NOVO: Adiciona o campo 'nomePortugues'
public enum DiaDaSemana {
    SEGUNDA("SEGUNDA"),
    TERCA("TERCA"),
    QUARTA("QUARTA"),
    QUINTA("QUINTA"),
    SEXTA("SEXTA"),
    SABADO("SABADO"),
    DOMINGO("DOMINGO");

    private final String nomeBanco;

    DiaDaSemana(String nomeBanco) {
        this.nomeBanco = nomeBanco;
    }

    public String getNomeBanco() {
        return nomeBanco;
    }
}