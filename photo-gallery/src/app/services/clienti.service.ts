import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  //Richiesta HTTP per la ricerca di tutti i biglietti acquistati dal cliente autenticato
  CercaBiglietti(credentials: {idCliente: string}): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/ricerca-biglietti`,  credentials);
  }
}
