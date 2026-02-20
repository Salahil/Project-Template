import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalSpinnerService {
  private visibilidadeSubject = new BehaviorSubject<boolean>(false);
  visibilidade$: Observable<boolean> = this.visibilidadeSubject.asObservable();

  private progressoSubject = new BehaviorSubject<number>(0);
  progresso$: Observable<number> = this.progressoSubject.asObservable();

  constructor() { }

  mostrar(progressoInicial: number = 0) {
    this.visibilidadeSubject.next(true);
    this.progressoSubject.next(progressoInicial);
  }

  ocultar() {
    this.visibilidadeSubject.next(false);
    this.progressoSubject.next(0);
  }

  atualizarProgresso(progresso: number) {
    // Garantir que o progresso esteja entre 0 e 100
    const progressoValidado = Math.max(0, Math.min(100, progresso));
    this.progressoSubject.next(progressoValidado);
  }
}
