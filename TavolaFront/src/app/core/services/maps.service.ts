// src/app/core/services/maps.service.ts
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Observable , Observer} from "rxjs"
import { map } from "rxjs/operators"

@Injectable({
  providedIn: "root",
})
export class MapsService {

  private geocoder: google.maps.Geocoder;

  constructor(private http: HttpClient) {
    this.geocoder = new google.maps.Geocoder();
  }
  

  private googleMapsApiKey = 'AIzaSyCUDeZfumwzHU8nU1iPvX2s6C0tAZYEaxQ';

  public getCoordinatesFromAddress(address: string): Observable<{ lat: number; lng: number }> {
    return new Observable((observer: Observer<{ lat: number; lng: number }>) => {
      this.geocoder.geocode({ address: address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          // Emite o resultado com sucesso
          observer.next({ lat: location.lat(), lng: location.lng() });
          observer.complete();
        } else {
          // Emite um erro se a conversão falhar
          observer.error(`A geocodificação falhou pelo seguinte motivo: ${status}`);
        }
      });
    });
  }
  
  async mostrarRotaNoGoogleMaps(destino: { lat: number; lng: number }): Promise<void> {
    try {
      const origem = await this.obterLocalizacaoAtual();
      this.abrirGoogleMapsComRota(origem, destino);
    } catch (error) {
      console.warn("Não foi possível obter a localização atual. Usando origem padrão (Goiânia).");
      const origemPadrao = { lat: -16.6869, lng: -49.2648 }; // Goiânia
      this.abrirGoogleMapsComRota(origemPadrao, destino);
    }
  }

  private obterLocalizacaoAtual(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject("Geolocalização não é suportada pelo navegador.");
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
        () => reject("Erro ao obter localização."),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  // **MÉTODO CORRIGIDO PARA ABRIR O MAPS**
  private abrirGoogleMapsComRota(origem: { lat: number; lng: number }, destino: { lat: number; lng: number }): void {
    // CORREÇÃO: Usando o formato de URL padrão e mais robusto do Google Maps.
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origem.lat},${origem.lng}&destination=${destino.lat},${destino.lng}&travelmode=driving`;
    window.open(url, "_blank");
  }
}
