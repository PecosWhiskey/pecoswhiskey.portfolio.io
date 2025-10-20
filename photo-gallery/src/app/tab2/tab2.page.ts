import { Component, OnInit } from '@angular/core';
import {IonHeader,IonContent,IonIcon,IonLabel,IonButton,IonCard,IonCardContent,
  IonCardHeader,IonCardTitle,IonItem,IonSelect,IonSelectOption} from '@ionic/angular/standalone';
import { Volo } from '../models/volo.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Service } from '../tab1/tab1.service';
import { SessionStorageService } from '../services/session-storage.service';
import { RouterModule, RouterLink} from '@angular/router';
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';
import { BigliettiService } from '../services/biglietti.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule, FormsModule, IonHeader, IonContent, IonIcon, IonLabel, IonButton, IonCard, IonCardHeader, IonCardTitle,
     IonCardContent, IonItem,IonSelect,IonSelectOption],
})
export class Tab2Page implements OnInit {

  constructor(private tab1Service: Tab1Service, private sessionStorageService: SessionStorageService,
    private bigliettiService: BigliettiService) {
      addIcons({informationCircleOutline});
    }

  //Valori che cambiano in base all'esito della ricerca effettuata nel tab1
  voliTrovatiAndata = false;
  voliTrovatiRitorno = false;

  //Biglietti trovati dalla ricerca nel tab1
  bigliettiAndata: Volo[] = [];
  bigliettiRitorno: Volo[] = [];

  //Informazioni sulla ricerca dell'utente
  ricercaInfo = { partenza: '', destinazione: '', dataPartenza: '', dataRitorno: '' };

  //Scelta dell'utente sui tipi di volo da cercare: andata e ritorno, solo andata, nessun selezionato
  sceltaUtente = 'nessun selezionato';

  //Filtro per la visualizzazione dei biglietti il cui prezzo è compreso in un certo intervallo
  filtroPrezzo = 'tutti'; //VALORI CHE PUò ASSUMERE: tutti, economici, medi, premium

  //Copia dei biglietti di andata e ritorno trovati utilizzati per filtrare i biglietti e mostrarli all'utente
  bigliettiAndataOriginari: Volo[] = this.bigliettiAndata;
  bigliettiRitornoOriginari: Volo[] = this.bigliettiRitorno;

  // Aggiungi queste proprietà per tracciare le selezioni
  bigliettoAndataSelezionato: Volo | null = null;
  bigliettoRitornoSelezionato: Volo | null = null;


  ngOnInit() {
    //Inizializzazione dei dati che vengono mostrati all'utente all'apertura della pagina
    //Recupero dal Tab1Service per ogni nuova ricerca effettuata
    this.tab1Service.getRicercaInfo().subscribe(info => {
      this.ricercaInfo = info;
    });

    this.tab1Service.getVoliTrovatiAndata().subscribe(founded => {
      this.voliTrovatiAndata = founded;
    })

    this.tab1Service.getVoliTrovatiRitorno().subscribe(founded => {
      this.voliTrovatiRitorno = founded;
    })

    this.tab1Service.getBigliettiAndata().subscribe(biglietti=> {
      this.bigliettiAndata = biglietti;
      this.bigliettiAndataOriginari = biglietti;
    })

    this.tab1Service.getBigliettiRitorno().subscribe(biglietti=> {
      this.bigliettiRitorno = biglietti;
      this.bigliettiRitornoOriginari = biglietti;
    })

    this.tab1Service.getSceltaUtente().subscribe(scelta => {
      this.sceltaUtente = scelta;
    })
    //Recupero dal SessionStorageService per ogni volta che viene ricaricata la pagina del Tab1
    const ricerca = this.sessionStorageService.getItem('ricercaInfo');
    if(ricerca != null){
      this.ricercaInfo = ricerca;
    }

    const bigliettiA = this.sessionStorageService.getItem('bigliettiAndata');
    if(bigliettiA != null){
      this.bigliettiAndata = bigliettiA;
      this.bigliettiAndataOriginari = bigliettiA;
    }

    const bigliettiR = this.sessionStorageService.getItem('bigliettiRitorno');
    if(bigliettiR != null){
      this.bigliettiRitorno = bigliettiR;
      this.bigliettiRitornoOriginari = bigliettiR;
    }

    const scelta = this.sessionStorageService.getItem('sceltaUtente');
    if(scelta != null){
      this.sceltaUtente = scelta;
    }

    const voliTrovatiA = this.sessionStorageService.getItem('voliAndataTrovati');
    if(voliTrovatiA != null){
      this.voliTrovatiAndata = voliTrovatiA;
    }

    const voliTrovatiR = this.sessionStorageService.getItem('voliRitornoTrovati');
    if(voliTrovatiA != null){
      this.voliTrovatiRitorno = voliTrovatiR;
    }
  };

  //Funzioni che gestiscono la selezione o la deselezione dei biglietti di andata e ritorno
  selezionaAndata(biglietto: Volo){
    this.bigliettoAndataSelezionato = biglietto;
    this.bigliettiService.setBigliettoAndata(this.bigliettoAndataSelezionato);
    this.sessionStorageService.setItem('biglietto di andata scelto', biglietto);
    console.log("Biglietto andata selezionato: ", this.bigliettiService.getBigliettoAndata());
  }

  deselezionaAndata(){
    this.bigliettoAndataSelezionato = null;
    this.bigliettiService.removeBigliettoAndata();
    console.log("Biglietto andata deselezionato: ", this.bigliettiService.getBigliettoAndata());
  }

  selezionaRitorno(biglietto: Volo){
    this.bigliettoRitornoSelezionato = biglietto;
    this.bigliettiService.setBigliettoRitorno(this.bigliettoRitornoSelezionato);
    this.sessionStorageService.setItem('biglietto di ritorno scelto', biglietto);
    console.log("Biglietto ritorno selezionato: ", this.bigliettiService.getBigliettoRitorno());
  }

  deselezionaRitorno(){
    this.bigliettoRitornoSelezionato = null;
    this.sessionStorageService.removeItem('biglietto di ritorno scelto');
    this.bigliettiService.removeBigliettoRitorno();
    console.log("Biglietto ritorno deselezionato: ", this.bigliettiService.getBigliettoRitorno());
  }

  //Funzioni helper per verificare se un biglietto è selezionato
  isBigliettoAndataSelezionato(biglietto: Volo): boolean {
    return this.bigliettoAndataSelezionato === biglietto;
  }

  isBigliettoRitornoSelezionato(biglietto: Volo): boolean {
    return this.bigliettoRitornoSelezionato === biglietto;
  }

  //Funzione che mostra i biglietti il cui prezzo rientrano in un certo intervallo, in base alla scelta dell'utente
  applicaFiltri(){
    switch(this.filtroPrezzo){
      case 'tutti':
        this.bigliettiAndata = this.bigliettiAndataOriginari;
        this.bigliettiRitorno = this.bigliettiRitornoOriginari;
        break;

      case 'economici':
        this.bigliettiAndata = this.bigliettiAndataOriginari.filter(volo=> volo.prezzo <= 100);
        this.bigliettiRitorno = this.bigliettiRitornoOriginari.filter(volo=> volo.prezzo <= 100);
        break;

      case 'medi':
        this.bigliettiAndata = this.bigliettiAndataOriginari.filter(volo=> volo.prezzo>100 && volo.prezzo<=300);
        this.bigliettiRitorno = this.bigliettiRitornoOriginari.filter(volo=> volo.prezzo>100 && volo.prezzo<=300);
        break;

      case 'premium':
        this.bigliettiAndata = this.bigliettiAndataOriginari.filter(volo=> volo.prezzo > 300);
        this.bigliettiRitorno = this.bigliettiRitornoOriginari.filter(volo=> volo.prezzo > 300);
        break;

      default:
        this.bigliettiAndata = this.bigliettiAndataOriginari;
        this.bigliettiRitorno = this.bigliettiRitornoOriginari;
        break;
    }

    console.log('Biglietti di andata filtrati: ', this.bigliettiAndata);
    console.log('Biglietti di ritorno filtrati:', this.bigliettiRitorno);
  }
}