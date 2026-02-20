import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface IEnderecoPayload {
  cep?: string;
  estado?: string;
  cidade?: string;
  bairro?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
}

export interface IUpdateUsuarioPayload {
  nome?: string;
  endereco?: IEnderecoPayload;
  telefone?: string;
  imagem?: string | null; // Base64 or URL for profile image
  imagemBackground?: string | null; // Base64 or URL for background image
  senha?: string;

  // Campos específicos de Restaurante (assumindo que o backend os aceita no /self/update)
  tipoCozinha?: string;
  descricao?: string;
  horariosFuncionamento?: { diaSemana: string; abertura: string; fechamento: string }[];
  nomesServicos?: string[];
  quantidadeMesas?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = `${environment.apiUrl}/auth/usuarios`; 

  constructor(private http: HttpClient) {}

  updateUsuario(payload: IUpdateUsuarioPayload): Observable<any> {
    return this.http.put(`${this.apiUrl}/self/update`, payload);
  }
}
