package TavolaSoftware.TavolaApp.tools;

public class Servicos {

	private boolean log;

	private boolean admMesas;

	private boolean admCardapio;

	private boolean accessIA;

	public boolean isLog() { return log; }
	public void setLog(boolean log) { this.log = log; }

	public boolean isAdmMesas() { return admMesas; }
	public void setAdmMesas(boolean acesso) { this.admMesas = acesso; }

	public boolean isAdmCardapio() { return admCardapio; }
	public void setAdmCardapio(boolean acesso) { this.admCardapio = acesso; }

	public boolean isAccessIA() { return accessIA; }
	public void setAccessIA(boolean acesso) { this.accessIA = acesso; }
}
