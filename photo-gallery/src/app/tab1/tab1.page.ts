import { Component } from '@angular/core';
import {IonHeader,IonToolbar,IonContent,IonIcon,IonLabel,IonButton,
  IonCardContent,IonSegment,IonSegmentButton,IonItem,IonInput, IonPopover, 
  IonDatetime, IonCardHeader, IonAlert } from '@ionic/angular/standalone';
import { Tab1Service } from './tab1.service';
import { Volo } from '../models/volo.models';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterLink} from '@angular/router';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonAlert, RouterLink, RouterModule, IonHeader,IonToolbar,IonContent,
    IonIcon,IonLabel,IonButton,IonCardContent,IonSegment,IonSegmentButton,IonItem,IonInput, FormsModule, IonDatetime, IonPopover],
})
export class Tab1Page {
  constructor(private tab1Service: Tab1Service, private sessionStorageService: SessionStorageService){}

  partenza = ''; //città di partenza
  destinazione = ''; //città di destinazione
  dataInseritaP = ''; //recupera la data di partenza inserita dall'utente con fuso e ora
  dataInseritaR = ''; //recupera la data di destinazione inserita dall'utente con fuso e ora
  dataPartenza = ''; //data di partenza senza fuso e ora
  dataRitorno = ''; //data di ritorno senza fuso e ora
  numPasseggeri = 1; //numero di passeggeri selezionato
  cercaVoloEsito = ''; //esito della ricerca sei voli

  trovati = false; //serve per visualizzare i biglietti trovati
  bigliettiAndata: Volo[] = []; //array dei biglietti di partenza trovati
  bigliettiRitorno: Volo[] = []; //array dei biglietti di ritorno trovati

  form= ''; //variabile che viene settata su 'Login' o 'Registrazione' per stabilire quale form mostrare

  scelta = 'nessun selezionato'; //assume il valore corrispondente alla scelta tra andata e ritorno o solo andata

  //Variabili che gestiscono la comparsa del pop up al click su "Iscriviti"
  email = "";
  isAlertOpen = false;
  alertButtons = ['Chiudi'];

  //Abilita il click su "Registrati" solo se il campo per inserire l'email è stato riempito
  isEmailValid(){
    return this.email;
  }

  //Gestisce l'apertura del pop up
  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  //Incremento o decremento del numero di passeggeri in base ai click effettuati dall'utente
  increment(){
    this.numPasseggeri++;
  }

  decrement(){
    this.numPasseggeri--;
  }

  //Abilita il bottone per la ricerca dei voli "Cerca" solo se tutti i campi sono stati riempiti.
  CampiValidi(){
    if(this.scelta == 'oneway'){
      return this.partenza && this.destinazione && this.dataInseritaP
    }else{
      return this.partenza && this.destinazione && this.dataInseritaP && this.dataInseritaR &&this.numPasseggeri!=0;
    }
  }

  //Ricerca i voli in base alle richieste dell'utente
  Cerca(){
    this.dataPartenza = this.dataInseritaP.split('T')[0];
    this.dataRitorno = this.dataInseritaR.split('T')[0];
    //Oggetto con i dati che devono essere inviati al server per la ricerca dei voli
    const datiVoloPartenza = {
      partenza: this.partenza.toUpperCase(),
      destinazione : this.destinazione.toUpperCase(),
      oraPartenza : this.dataPartenza
    }
    //Oggetto con le informazioni sulla ricerca da mostrare nel tab2
    const ricercaInfo = {
      partenza : this.partenza.toUpperCase(),
      destinazione : this.destinazione.toUpperCase(),
      dataPartenza : this.dataPartenza,
      dataRitorno : this.dataRitorno
    }
    //Memorizza le informazioni sulla ricerca dell'utente nel SessionStorage e nel service del tab1
    this.sessionStorageService.setItem('ricercaInfo', ricercaInfo);
    this.sessionStorageService.setItem('numero passeggeri', this.numPasseggeri);
    this.tab1Service.setRicercaInfo(ricercaInfo);
    //Ricerca dei voli per la data di partenza
    this.tab1Service.CercaVolo(datiVoloPartenza).subscribe({
        next: (response) => {
        console.log('Search success:', response);
        this.cercaVoloEsito= response.message;
        this.trovati = true;
        //Memorizza il risultato della ricerca
        this.tab1Service.setVoliTrovatiAndata(this.trovati);
        //Memorizza temporaneamente il risultato della ricerca dei voli di andata nel Session Storage
        this.sessionStorageService.setItem('voliAndataTrovati', this.trovati);
        //Memorizza i biglietti trovati nel service a cui accederà l'altro tab per mostrarli
        this.bigliettiAndata = response.data;
        this.tab1Service.setBigliettiAndata(this.bigliettiAndata);
        //Memorizza temporaneamente i biglietti di andata trovati nel Session Storage
        this.sessionStorageService.setItem('bigliettiAndata', this.bigliettiAndata);
        //Memorizza la scelta dell'utente
        this.tab1Service.setSceltaUtente(this.scelta);
        this.sessionStorageService.setItem('sceltaUtente', this.scelta);
       },
       error: (err) => {
        console.log('Search error:', err);
        this.cercaVoloEsito = err.error.message;
       },
      });
      //Se la scelta è stata "andata e ritorno" oppure "nessuna scelta" allora vengono cercati anche i voli di ritorno
      if(this.scelta == 'roundtrip' || this.scelta == 'nessun selezionato'){
        const datiVoloRitorno = {
          partenza: this.destinazione.toUpperCase(),
          destinazione : this.partenza.toUpperCase(),
          oraPartenza : this.dataRitorno
        }
        this.tab1Service.CercaVolo(datiVoloRitorno).subscribe({
          next: (response) => {
            console.log('Search success:', response);
            this.cercaVoloEsito= response.message;
            this.trovati = true;
            //Memorizza il risultato della ricerca
            this.tab1Service.setVoliTrovatiRitorno(this.trovati);
            //Memorizza temporaneamente il risultato della ricerca dei voli di ritorno nel Session Storage
            this.sessionStorageService.setItem('voliRitornoTrovati', this.trovati);
             //Memorizza i biglietti trovati nel service a cui accederà l'altro tab per mostrarli
            this.bigliettiRitorno = response.data;
            this.tab1Service.setBigliettiRitorno(this.bigliettiRitorno);
            //Memorizza temporaneamente i biglietti di ritorno trovati nel Session Storage
            this.sessionStorageService.setItem('bigliettiRitorno', this.bigliettiRitorno);
          },
          error: (err) => {
            console.log('Search error:', err);
            this.cercaVoloEsito = err.error.message;
          },
        });
      }
  }

  //Funzione che inverte la città di partenza con quella di destinazione
  invertiCitta(){
    const temp = this.partenza;
    this.partenza = this.destinazione;
    this.destinazione = temp;
  }

  onClick(){
    console.log("Click su ", this.scelta);
    //Memorizza la scelta dell'utente tra andata e ritorno o solamente andata per effettuare la ricerca dei voli
    this.tab1Service.setSceltaUtente(this.scelta);
    this.sessionStorageService.setItem('sceltaUtente', this.scelta);
  }
}
