import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IRestaurante } from '../../Interfaces/IRestaurante.interface';
import { IUpdateRestaurantePayload } from '../../Interfaces/IUpdateRestaurantePayload.interface';
import { IPesquisaRestaurantePayload } from '../../Interfaces/IPesquisaRestaurantePayload.interface';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RestauranteService {
  private http = inject(HttpClient);
  // URL base da sua API, pode vir do environment
  private apiUrl = `${environment.apiUrl}/auth/restaurantes`;

  // NEW: BehaviorSubjects for centralized data
  private _allRestaurants = new BehaviorSubject<IRestaurante[]>([]);
  public allRestaurants$: Observable<IRestaurante[]> = this._allRestaurants.asObservable();

  private _allCities = new BehaviorSubject<string[]>([]);
  public allCities$: Observable<string[]> = this._allCities.asObservable();

  private _allCuisines = new BehaviorSubject<string[]>([]);
  public allCuisines$: Observable<string[]> = this._allCuisines.asObservable();

  constructor() {
    // Removed automatic fetch to avoid duplicate requests
    // The home component will trigger the initial fetch when needed
  }

  // Helper to process restaurant data and update subjects
  private processAndSetRestaurantData(restaurants: IRestaurante[]): void {
    this._allRestaurants.next(restaurants);

    const citiesSet = new Set<string>();
    const cuisinesSet = new Set<string>();

    restaurants.forEach(r => {
      if (r.endereco?.cidade) { 
        citiesSet.add(r.endereco.cidade); // Only city, as per user request
      }
      if (r.tipoCozinha) {
        cuisinesSet.add(r.tipoCozinha);
      }
    });

    this._allCities.next(Array.from(citiesSet).sort());
    // Adjusted to only emit fetched cuisines
    this._allCuisines.next(Array.from(cuisinesSet).sort());
  }

  getRestaurantes(): Observable<IRestaurante[]> {
    // Use tap to update BehaviorSubject after fetching
    return this.http.get<IRestaurante[]>(this.apiUrl).pipe(
      tap(restaurants => this.processAndSetRestaurantData(restaurants))
    );
  }

  findById(id: string): Observable<IRestaurante> {
    return this.http.get<IRestaurante>(`${this.apiUrl}/${id}`);
  }

  getRestaurantImages(id: string): Observable<string[]> {
    return of(['assets/jpg/restauranteModelo.jpg', 'assets/jpg/restauranteModelo.jpg', 'assets/jpg/restauranteModelo.jpg']);
  }

  favoritarRestaurante(id: string) {
    return this.http.post(`${this.apiUrl.replace('/auth/restaurantes','/auth/clientes/favoritar')}/${id}`, {});
  }

  updateRestaurante(payload: IUpdateRestaurantePayload): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, payload);
  }

  deleteRestaurante(): Observable<any> {
    return this.http.delete(`${this.apiUrl}`);
  }

  pesquisarRestaurantes(payload: IPesquisaRestaurantePayload): Observable<IRestaurante[]> {
    return this.http.post<IRestaurante[]>(`${this.apiUrl}/pesquisar`, payload);
  }

  // Métodos para gerenciar garçons
  getGarcons(idRestaurante: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl.replace('/auth/restaurantes', '/auth/api/restaurantes')}/${idRestaurante}/garcons`);
  }

  postGarcom(idRestaurante: string, payload: { nome: string; senha: string; imagem: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl.replace('/auth/restaurantes', '/auth/api/restaurantes')}/${idRestaurante}/garcons`, payload);
  }

  putGarcom(idRestaurante: string, idGarcom: string, payload: { nome: string; senha: string; imagem: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl.replace('/auth/restaurantes', '/auth/api/restaurantes')}/${idRestaurante}/garcons/${idGarcom}`, payload);
  }

  deleteGarcom(idRestaurante: string, idGarcom: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl.replace('/auth/restaurantes', '/auth/api/restaurantes')}/${idRestaurante}/garcons/${idGarcom}`);
  }

  // Método para buscar ambientes do dashboard
  getAmbientes(idRestaurante: string, data: string | Date): Observable<any[]> {
    // Formata a data para YYYY-MM-DD
    let dataFormatada: string;
    if (data instanceof Date) {
      const year = data.getFullYear();
      const month = String(data.getMonth() + 1).padStart(2, '0');
      const day = String(data.getDate()).padStart(2, '0');
      dataFormatada = `${year}-${month}-${day}`;
    } else {
      dataFormatada = data.split('T')[0]; // Garante formato YYYY-MM-DD
    }
    
    return this.http.get<any[]>(
      `${this.apiUrl.replace('/auth/restaurantes', '/auth/api/restaurantes')}/${idRestaurante}/dashboard/ambientes?data=${dataFormatada}`
    );
  }
}