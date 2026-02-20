import { Injectable } from '@angular/core';
import { IDadosEventoCalendario } from '../../Interfaces/IDadosEventoCalendario.interface';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() { }

  /**
   * Gera um link para adicionar um evento ao Google Calendar.
   * @param dados Os detalhes do evento a ser criado.
   * @returns Uma string com a URL completa.
   */
  public criarLinkGoogleCalendar(dados: IDadosEventoCalendario): string {
    const dataInicioISO = dados.dataInicio.toISOString().replace(/-|:|\.\d+/g, '');

    const duracao = dados.duracaoHoras || 2;
    const dataFim = new Date(dados.dataInicio.getTime() + duracao * 60 * 60 * 1000);
    const dataFimISO = dataFim.toISOString().replace(/-|:|\.\d+/g, '');

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: dados.titulo,
      dates: `${dataInicioISO}/${dataFimISO}`,
      details: dados.descricao || '',
      location: dados.localizacao || '',
      trp: 'false' // Define o evento como "ocupado"
    });

    return `https://www.google.com/calendar/render?${params.toString()}`;
  }
}
