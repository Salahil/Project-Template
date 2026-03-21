import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Perfil {
  nome: string;
  id?: string;
  imagem?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_NAME_KEY = 'nome';
  private readonly USER_ID_KEY = 'userId';
  private readonly USER_IMAGE_KEY = 'imagemUsuario';

  private _token: string | null = null;
  private _perfil: Perfil | null = null;
  private readonly BASE_IMAGE_URL = `${environment.apiUrl}`;

  constructor() {
    this._token = localStorage.getItem(this.TOKEN_KEY);
    const nome = localStorage.getItem(this.USER_NAME_KEY);
    const id = localStorage.getItem(this.USER_ID_KEY) || undefined;
    const imagem = localStorage.getItem(this.USER_IMAGE_KEY) || undefined;

    if (nome) {
      this._perfil = { nome, id, imagem };
    }
  }

  setAuthData(token: string, nome: string, id?: string, imagem?: string | null) {
    this.setToken(token);
    this.setPerfil({ nome, id, imagem });
    localStorage.setItem(this.USER_NAME_KEY, nome);
    if (id) {
      localStorage.setItem(this.USER_ID_KEY, id);
    } else {
      localStorage.removeItem(this.USER_ID_KEY);
    }
    if (imagem) {
      localStorage.setItem(this.USER_IMAGE_KEY, imagem);
    } else {
      localStorage.removeItem(this.USER_IMAGE_KEY);
    }
  }

  setToken(token: string) {
    this._token = token;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setPerfil(perfil: Perfil) {
    this._perfil = perfil;
    localStorage.setItem(this.USER_NAME_KEY, perfil.nome);
    if (perfil.id) {
      localStorage.setItem(this.USER_ID_KEY, perfil.id);
    } else {
      localStorage.removeItem(this.USER_ID_KEY);
    }
    if (perfil.imagem) {
      localStorage.setItem(this.USER_IMAGE_KEY, perfil.imagem);
    } else {
      localStorage.removeItem(this.USER_IMAGE_KEY);
    }
  }

  get perfil(): Perfil | null {
    if (this._perfil) {
      return this._perfil;
    }

    const nome = localStorage.getItem(this.USER_NAME_KEY);
    const id = localStorage.getItem(this.USER_ID_KEY) || undefined;
    const imagem = localStorage.getItem(this.USER_IMAGE_KEY) || undefined;

    if (nome && this.getToken()) {
      this._perfil = { nome, id, imagem };
      return this._perfil;
    }

    return null;
  }

  clearAuthData() {
    this._token = null;
    this._perfil = null;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_NAME_KEY);
    localStorage.removeItem(this.USER_ID_KEY);
    localStorage.removeItem(this.USER_IMAGE_KEY);
  }

  getAbsoluteImageUrl(relativePath: string | null | undefined): string {
    if (relativePath) {
      return `${this.BASE_IMAGE_URL}${relativePath}`;
    }
    return '';
  }
}
