import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Biglietto } from '../models/biglietto.models';
import { Passeggero } from '../models/passeggero.models';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Volo } from '../models/volo.models';

@Injectable({
  providedIn: 'root'
})
export class BigliettiService {

  private baseUrl = 'http://localhost:3000';

  private numBigliettiCreatiAndata = new BehaviorSubject<number>(0);
  private numBigliettiCreatiRitorno = new BehaviorSubject<number>(0);
  private bigliettoModificato = new BehaviorSubject<any>(null);
  private bigliettoAndata = new BehaviorSubject<Volo>({
    idVolo: '', 
    partenza: '',
    destinazione: '',
    oraPartenza: '',
    oraArrivo: '',
    prezzo: 0.0,
    postiDisponibili: 0
  });
  private bigliettoRitorno = new BehaviorSubject<Volo>({
    idVolo: '', 
    partenza: '',
    destinazione: '',
    oraPartenza: '',
    oraArrivo: '',
    prezzo: 0.0,
    postiDisponibili: 0
  });

  constructor(private http: HttpClient) {}

  //Richiesta HTTP per la creazione di un nuovo biglietto, effettuata durante l'acquisto
  CreaBiglietto(credentials: Biglietto): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/creazione-biglietto`, credentials);
  }

  //Richiesta HTTP per l'inserimento nel database dei dati del passeggero che sta acquistando un biglietto
  CreaPasseggero(credentials: Passeggero): Observable<any>{
    return this.http.post(`${this.baseUrl}/api/auth/inserimento-passeggero`, credentials);
  }

  //Richiesta HTTP per il decremento dei posti disponibili del volo per cui è stato acquistato un biglietto
  ModificaVolo(credentials: {idVolo: string, posti: number}): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/decremento-posti`, credentials);
  }

  //Richiesta HTTP per la ricerca di un biglietto eseguita prima di procedere con il check-in
  CercaBiglietto(credentials: {idPasseggero:string, idBiglietto: number}): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/cerca-biglietto`, credentials);
  }

  //Richiesta HTTP per l'inserimento dei nuovi dati in un biglietto già esistente dopo aver completato il check-in
  ModificaBiglietto(credentials: {idBiglietto: number, tariffa:string, posto: string, prezzoFinale: number}): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/modifica-biglietto`, credentials);
  }

  //Richiesta HTTP per ricavare i posti già prenotati da altri utenti per un determinato volo
  OttieniPostiOccupati(credentials: {idVolo: string}): Observable<any>{
    return this.http.post(`${this.baseUrl}/api/auth/posti-occupati`, credentials);
  }

  //Funzioni che memorizzano e ricavano il numero di biglietti creati sia di andata che di ritorno
  setnumBigliettiCreatiAndata(numero: number) {
    this.numBigliettiCreatiAndata.next(numero);
  }
  
  getnumBigliettiCreatiAndata(): Observable<number>{
    return this.numBigliettiCreatiAndata.asObservable();
  }

  setnumBigliettiCreatiRitorno(numero: number) {
    this.numBigliettiCreatiRitorno.next(numero);
  }
  
  getnumBigliettiCreatiRitorno(): Observable<number>{
    return this.numBigliettiCreatiRitorno.asObservable();
  }

  //Funzioni che memorizzano e ricavano il biglietto modificato del cliente dopo il check-in
  setBigliettoModificato(numero: number) {
    this.bigliettoModificato.next(numero);
  }
  
  getBigliettoModificato(): Observable<number>{
    return this.bigliettoModificato.asObservable();
  }

  //Funzioni che memorizzano, ricavano e cancellano i biglietti selezionati nel Tab2 sia di andata che di ritorno
  setBigliettoAndata(biglietto: Volo) {
    this.bigliettoAndata.next(biglietto);
  }
  
  getBigliettoAndata(): Observable<Volo>{
    return this.bigliettoAndata.asObservable();
  }

  removeBigliettoAndata(){
    this.setBigliettoAndata({
      idVolo: '', 
      partenza: '',
      destinazione: '',
      oraPartenza: '',
      oraArrivo: '',
      prezzo: 0.0,
      postiDisponibili: 0
    });
  }

  setBigliettoRitorno(biglietto: Volo) {
    this.bigliettoRitorno.next(biglietto);
  }
  
  getBigliettoRitorno(): Observable<Volo>{
    return this.bigliettoRitorno.asObservable();
  }

  removeBigliettoRitorno(){
    this.setBigliettoRitorno({
      idVolo: '', 
      partenza: '',
      destinazione: '',
      oraPartenza: '',
      oraArrivo: '',
      prezzo: 0.0,
      postiDisponibili: 0
    });
  }

  //Funzione che resetta il numero di biglietti creati quando si esce dalla pagina "crea-biglietto"
  resetBigliettiCreati() {
    this.numBigliettiCreatiAndata.next(0);
    this.numBigliettiCreatiRitorno.next(0);
  }
}