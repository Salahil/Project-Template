package TavolaSoftware.TavolaApp.tools;

public enum EventLabel {
	
	MESA_UPDATE_STATUS, 				// update no status da mesa
	MESA_ACTION_GARCOM, 				// mesa está chamando garçom
	PEDIDO_UPDATE_NEW,					// novo pedido foi lançado
	PEDIDO_UPDATE_CANCEL,				// o pedido foi cancelado
	RESERVA_UPDATE_STATUS,				// status da reserva foi alterado
	RESERVA_UPDATE_MESA,				// a reserva mudou de mesa
	RESERVA_UPDATE_NEW,					// nova reserva
	CLIENTE_UPDATE_NOTIFICACAO,			// cliente recebeu uma nova notificação
	RESTAURANTE_UPDATE_NOTIFICACAO,		// restaurante recebeu uma nova notificação
	MESA_LIBERADA, 
	MESA_ATENDIMENTO;		
	// caso apareçam mais...
}
