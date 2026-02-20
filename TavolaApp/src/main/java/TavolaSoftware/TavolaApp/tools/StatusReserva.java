package TavolaSoftware.TavolaApp.tools;

public enum StatusReserva {
    PENDENTE, // foi lançada mas o restaurante ainda não a recebeu
    CONFIRMADA, // o restaurante reealocou a data da reserva, o cliente não confirmou
    ATIVA, // o restauarante confirmou que essa reserva
    LISTA_ESPERA, // a reserva foi enviada e recebida, está aguardando a confirmação do restaurante
    CANCELADA_CLIENTE, // o cliente cancelou
    CANCELADA_RESTAURANTE, // o restaurante cancelou
    CONCLUIDA, // o cliente participou da reserva, comeu, pagou e foi embora
    NAO_COMPARECEU // o cliente não compareceu, essa parte é mais complicada...
}