// contact.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'https://epd.loopmotion.tech/php/procesar-formulario.php';

  constructor(private http: HttpClient) { }

  enviarFormulario(formData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}