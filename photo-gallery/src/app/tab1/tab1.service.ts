import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Volo } from '../models/volo.models';
import { RicercaInfo } from '../models/ricercaInfo.models';
import { BehaviorSubject } from 'rxjs'; 
import { environment } from '../../environments/environment';
//permette di memorizzare lo stato corrente e aggiornare gli altri tab quando i dati cambiano

@Injectable({
  providedIn: 'root'
})
export class Tab1Service {

  private baseUrl = environment.apiUrl;
  //Dati inseriti dall'utente per la ricerca dei voli
  private ricercaInfo = new BehaviorSubject<RicercaInfo>({partenza:'', destinazione: '', dataPartenza: '', dataRitorno: ''});
  //Voli di andata e ritorno trovati nel database corrispondenti ai criteri di ricerca
  private bigliettiAndata = new BehaviorSubject<Volo[]>([]);
  private bigliettiRitorno = new BehaviorSubject<Volo[]>([]);
  //Variabili che tengono traccia dello stato della ricerca, ovvero del riscontro positivo o negativo da parte del server
  private voliTrovatiAndata = new BehaviorSubject<boolean>(false);
  private voliTrovatiRitorno = new BehaviorSubject<boolean>(false);
  //Scelta dell'utente tra ANDATA E RITORNO oppure SOLO ANDATA oppure nessuna scelta
  private sceltaUtente = new BehaviorSubject<string>('nessun selezionato'); 

  constructor(private http: HttpClient) {}

  //Richiesta HTTP per la ricerca dei voli corrispondenti ai criteri di ricerca dell'utente
  CercaVolo(credentials: { partenza: string, destinazione: string, oraPartenza: string}): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/ricerca-volo`, credentials);

  }

  //Funzioni che memorizzano e ricavano le informazioni sulla ricerca dell'utente e i risultati inviati dal server
  setRicercaInfo(info: RicercaInfo) {
    this.ricercaInfo.next(info);
  }

  getRicercaInfo(): Observable<RicercaInfo>{
    return this.ricercaInfo.asObservable();
  }

  setBigliettiAndata(biglietti: Volo[]){
    this.bigliettiAndata.next(biglietti);
  }

  getBigliettiAndata(): Observable<Volo[]>{
    return this.bigliettiAndata.asObservable();
  }

  setBigliettiRitorno(biglietti: Volo[]){
    this.bigliettiRitorno.next(biglietti);
  }

  getBigliettiRitorno(): Observable<Volo[]>{
    return this.bigliettiRitorno.asObservable();
  }

  setVoliTrovatiAndata(founded: boolean) {
    this.voliTrovatiAndata.next(founded);
  }

  getVoliTrovatiAndata(): Observable<boolean>{
    return this.voliTrovatiAndata.asObservable();
  }

  setVoliTrovatiRitorno(founded: boolean) {
    this.voliTrovatiRitorno.next(founded);;
  }

  getVoliTrovatiRitorno(): Observable<boolean>{
    return this.voliTrovatiRitorno.asObservable();
  }

  setSceltaUtente(scelta: string){
    this.sceltaUtente.next(scelta);
  }

  getSceltaUtente(): Observable<string>{
    return this.sceltaUtente.asObservable();
  }
}
