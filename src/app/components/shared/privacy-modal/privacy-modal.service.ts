// privacy-modal.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrivacyModalService {
  private openModalSource = new Subject<void>();
  
  // Observable que pueden escuchar los componentes
  openModal$ = this.openModalSource.asObservable();

  constructor() { }

  // Método para abrir el modal
  openModal(): void {
    this.openModalSource.next();
  }
}