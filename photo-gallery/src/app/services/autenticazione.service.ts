import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../models/cliente.models';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutenticazioneService {

  private baseUrl = environment.apiUrl; 

  constructor(private http : HttpClient) {}

  //Richiesta HTTP di login per il cliente
  loginClient(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/login-cliente`, credentials); 
    
  } 

  //Richiesta HTTP di registrazione per il cliente
  register(credentials: Cliente) : Observable<any>{
    console.log("dati in autenticazione service: ", credentials);
    return this.http.post(`${this.baseUrl}/api/auth/registrazione-cliente`, credentials);
  }

  //Richiesta HTTP di login per l'amministratore
  loginAdmin(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/login-admin`, credentials); 
    
  }
}
