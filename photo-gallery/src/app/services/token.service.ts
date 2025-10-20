import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode'; //libreria che serve per decodificare il token

//Interfaccia che definisce le proprietà del payload del token ricevuto
interface TokenPayload {
  idCliente: string;
  nome: string;
  cognome: string;
  email: string;
  role: string;
  iat: number; //data in cui è stato creato il token
  exp: number; //scadenza del token
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private TOKEN_KEY = "access token"; //chiave a cui viene associato il token
  private CLIENT_KEY = "client info"; //chiave a cui vengono associate le info del cliente presenti nel payload del token
  private ADMIN_KEY = "admin info";   //chiave a cui vengono associate le info dell'amministratore presenti nel payload del token

  constructor() {}

  //Funzioni che memorizzano e ricavano il token con la chiave specifica
  setToken(token: string){
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): any{
    return localStorage.getItem(this.TOKEN_KEY);
  }

  //Funzione che esegue il logout cancellando tutti i dati memorizzati con il login o con la registrazione
  logout(){
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.CLIENT_KEY);
    localStorage.removeItem(this.ADMIN_KEY);
  }

  //Funzioni che memorizzano e ricavano le informazioni degli utenti (clienti o amministratori) utilizzando le chiavi specifiche
  setClientInfo(clientInfo: any){
    localStorage.setItem(this.CLIENT_KEY, JSON.stringify(clientInfo));
  }

  setAdminInfo(adminInfo: any){
    localStorage.setItem(this.ADMIN_KEY, JSON.stringify(adminInfo));
  }

  getClientInfo(): any{
    const info = localStorage.getItem(this.CLIENT_KEY);
    return info ? JSON.parse(info) : null;
  }

  getAdminInfo(): any {
    const info = localStorage.getItem(this.ADMIN_KEY);
    return info ? JSON.parse(info) : null;
  }

  //Funzione che verifica se l'utente è autenticato con un token ancora valido
  isLogged(){
    const isExpired = this.isTokenExpired();
    return !isExpired;
  }

  //Funzione che verifica se il token è scaduto
  isTokenExpired(){
    const token = this.getToken();
    if (!token) return true;

    try {
      //Decodifica il token
      const decoded = jwtDecode<TokenPayload>(token);
      console.log("Token decodificato in isTokenExpired: ", decoded);
      //Ottiene la data corrente
      const currentTime = Math.floor(Date.now() / 1000); //tempo attuale in secondi

      //Confronta il tempo attuale con la data di scadenza del token (restituisce true se il token è scaduto)
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Errore nella decodifica del token:', error);
      return true; //se si è verificato un errore di qualsiasi tipo il token non può essere valido
    }
  }

  //Funzioni che estraggono le informazioni del cliente o dell'amministratore dal payload del token
  getClientInfoFromToken(token: string): any {
    try {
      if (!token) {
        throw new Error('Token non fornito');
      }

      //Decodifica il token
      const decodedInfo = jwtDecode<TokenPayload>(token);
      console.log("Token decodificato: ", decodedInfo);

      //Crea l'oggetto che contiene solo le informazioni sul cliente contenute nel payload
      const clientInfo = {
        idCliente: decodedInfo.idCliente, 
        nome: decodedInfo.nome,
        cognome: decodedInfo.cognome,
        email: decodedInfo.email, 
        role: decodedInfo.role
      };
    
      //Restituisce l'oggetto appena definito
      return clientInfo;
    
    } catch (error) {
      console.error('Errore nella decodifica del token:', error);
      throw new Error('Impossibile estrarre le informazioni del cliente dal token');
    }
  }

  getAdminInfoFromToken(token: string): any {
    try {
      if (!token) {
        throw new Error('Token non fornito');
      }

      //Decodifica il token
      const decodedInfo = jwtDecode<TokenPayload>(token);
      console.log("Token decodificato: ", decodedInfo);

      //Crea l'oggetto che contiene solo le informazioni sull'amministratore contenute nel payload
      const adminInfo = {email: decodedInfo.email, role: decodedInfo.role};
    
      //Restituisce l'oggetto appena definito
      return adminInfo;
    
    } catch (error) {
      console.error('Errore nella decodifica del token:', error);
      throw new Error("Impossibile estrarre le informazioni dell'admin dal token");
    }
  }
}