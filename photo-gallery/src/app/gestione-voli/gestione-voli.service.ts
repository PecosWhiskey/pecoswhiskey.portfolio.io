import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Volo } from '../models/volo.models';

@Injectable({
  providedIn: 'root'
})
export class GestioneVoliService {

  private baseUrl = 'http://localhost:3000';
  //Dati del volo da modificare ottenuti dalla pagina "voli-disponibili"
  private datiVolo = new BehaviorSubject<Volo>({
    idVolo: '', 
    partenza: '',
    destinazione: '',
    oraPartenza: '',
    oraArrivo: '',
    prezzo: 0.0,
    postiDisponibili: 0
  });

  constructor(private http: HttpClient) {}
  //Richiesta HTTP per la creazione di un nuovo volo
  Crea(credentials: { idVolo: string, partenza: string, destinazione: string, oraPartenza: string, oraArrivo: string, prezzo: number, postiDisponibili: number}): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/creazione-volo`, credentials,);

  }
  //Richiesta HTTP per la modifica di un volo esistente
  Modifica(credentials: { idVolo: string, partenza: string, destinazione: string, oraPartenza: string, oraArrivo: string, prezzo: number, postiDisponibili: number}): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/modifica-volo`, credentials);
  }
  //Richiesta HTTP per la ricerca di tutti i voli presenti nel database
  CercaVoliDisponibili(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/auth/voli-disponibili`);
  }
  //Richiesta HTTP per la ricerca di tutti i biglietti acquistati 
  CercaBigliettiAcquistati(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/auth/prenotazioni-ricevute`);
  }

  //Funzioni che memorizzano e ricavano i dati del volo da modificare, ottenuti dalla pagina "voli-disponibili"
  setDatiVolo(volo: Volo){
    this.datiVolo.next(volo);
  }

  getDatiVolo(){
    return this.datiVolo.asObservable();
  }
}
