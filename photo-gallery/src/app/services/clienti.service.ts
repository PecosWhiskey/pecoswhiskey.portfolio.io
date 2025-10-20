import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  //Richiesta HTTP per la ricerca di tutti i biglietti acquistati dal cliente autenticato
  CercaBiglietti(credentials: {idCliente: string}): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/ricerca-biglietti`,  credentials);
  }
}
