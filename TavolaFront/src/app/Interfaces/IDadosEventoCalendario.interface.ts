export interface IDadosEventoCalendario {
    titulo: string;
    dataInicio: Date; // A data e hora de início da reserva
    duracaoHoras?: number; // Opcional, vamos usar 2 horas como padrão
    localizacao?: string; // Endereço do restaurante
    descricao?: string; // Detalhes da reserva
  }