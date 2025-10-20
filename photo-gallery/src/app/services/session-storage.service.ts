import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  //Funzioni che memorizzano, ricavano e cancellano dati nel SessionStorage
  setItem(key: string, value: any){
    //Prima di memorizzare il value, viene convertito in una stringa
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string): any{
    //Viene prima ottenuta la stringa associata alla chiave data
    const data = sessionStorage.getItem(key);
    //Viene quindi restituito l'oggetto originale se esistente, altrimenti null
    return data ? JSON.parse(data) : null;
  }

  removeItem(key: string){
    sessionStorage.removeItem(key);
  }
}
