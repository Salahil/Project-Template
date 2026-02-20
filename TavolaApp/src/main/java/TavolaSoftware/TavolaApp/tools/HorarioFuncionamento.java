package TavolaSoftware.TavolaApp.tools;

import jakarta.persistence.Embeddable;

@Embeddable
public class HorarioFuncionamento {
    private String diaSemana;
    private String abertura;
    private String fechamento;
    
	public String getDiaSemana() {
		return diaSemana;
	}
	public String getAbertura() {
		return abertura;
	}
	public String getFechamento() {
		return fechamento;
	}
	public void setDiaSemana(String diaSemana) {
		this.diaSemana = diaSemana;
	}
	public void setAbertura(String abertura) {
		this.abertura = abertura;
	}
	public void setFechamento(String fechamento) {
		this.fechamento = fechamento;
	}
}
