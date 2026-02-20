import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StickySearchService {
  private _sticky = new BehaviorSubject<boolean>(false);
  sticky$ = this._sticky.asObservable();

  private _sidebarAberta = new BehaviorSubject<boolean>(true); // Assuming sidebar starts open
  sidebarAberta$ = this._sidebarAberta.asObservable();

  constructor() {}

  setSticky(value: boolean) {
    this._sticky.next(value);
  }

  getSticky(): boolean {
    return this._sticky.value;
  }

  setSidebarAberta(value: boolean) {
    this._sidebarAberta.next(value);
  }
} 