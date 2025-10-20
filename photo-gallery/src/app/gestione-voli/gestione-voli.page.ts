import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonItem, IonDatetime, IonInput,IonIcon, IonAlert, IonToolbar,IonHeader} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, listOutline, addCircleOutline, personOutline, ticketOutline, airplaneOutline,
  calendarOutline, timeOutline, peopleOutline, cardOutline, locationOutline, barcodeOutline, 
  informationCircleOutline} from 'ionicons/icons';
import { GestioneVoliService } from './gestione-voli.service';
import { RouterModule, RouterLink } from '@angular/router';
import { Volo } from '../models/volo.models';

@Component({
  selector: 'app-gestione-voli',
  templateUrl: './gestione-voli.page.html',
  styleUrls: ['./gestione-voli.page.scss'],
  standalone: true,
  imports: [IonAlert, IonInput, IonDatetime, IonButton, IonItem, IonContent, IonIcon, 
    IonToolbar, IonHeader,CommonModule, FormsModule, RouterModule, RouterLink]
})
export class GestioneVoliPage implements OnInit{

  constructor(private gestioneVoliService: GestioneVoliService) {
    addIcons({ createOutline, listOutline, addCircleOutline, personOutline, ticketOutline, airplaneOutline,
      calendarOutline, timeOutline, peopleOutline, cardOutline, locationOutline, barcodeOutline, informationCircleOutline });
  }

  //Dati richiesti in fase di creazione/modifica di un volo
  idVolo = '';
  partenza = '';
  destinazione = '';
  data = '';
  oraPartenza = '';
  oraArrivo = '';
  prezzo = 0.0;
  postiDisponibili = 0;
  creaVoloEsito = '';

  volo!: Volo;

  ngOnInit(): void {
    //Inizializzazione dei dati del volo da modificare selezionato nella pagina "voli-disponibili"
    this.gestioneVoliService.getDatiVolo().subscribe(volo => {
      if(volo){
        this.idVolo = volo.idVolo;
        this.partenza = volo.partenza;
        this.destinazione = volo.destinazione;
        this.data = volo.oraPartenza.split(' ')[0];
        this.oraPartenza = volo.oraPartenza.split(' ')[1];
        this.oraArrivo = volo.oraArrivo.split(' ')[1];
        this.prezzo = volo.prezzo;
        this.postiDisponibili = volo.postiDisponibili;
      }
    });
  }

  //Uscendo dalla pagina qualsiasi messaggio di errore mostrato viene cancellato
  ionViewWillLeave(){
    this.creaVoloEsito = '';
  }

  //Variabili e funzioni che gestiscono la comparsa dell'alert al click su "Crea Volo" o "Modifica Volo" in caso di successo
  isAlertOpenCreated = false;
  isAlertOpenModified = false;
  alertButtons = ['OK'];
  message = '';

  setOpenCreated(isOpen: boolean) {
    this.isAlertOpenCreated = isOpen;
  }

  setOpenModified(isOpen: boolean){
    this.isAlertOpenModified = isOpen;
  }


  //Funzione che formatta la data ottenuta dal tag "ion-datetime"
  formattaData(dataRicevuta: string, ora: string) {
    console.log("Data: ", dataRicevuta);
    const dataStringa = dataRicevuta.split('T')[0];
    console.log("Data Stringa: ", dataStringa);
    const dataFormattata = dataStringa + ' ' + ora;
    console.log("Data formattata: ", dataFormattata);
    return dataFormattata;
  }

  //Funzione che gestisce la creazione di un volo
  CreaVolo() {
    //Formatto le date
    const oraP = this.formattaData(this.data, this.oraPartenza);
    const oraA = this.formattaData(this.data, this.oraArrivo);
    const datiVolo = {
      idVolo: this.idVolo,
      partenza: this.partenza.toUpperCase(),
      destinazione: this.destinazione.toUpperCase(),
      oraPartenza: oraP,
      oraArrivo: oraA,
      prezzo: this.prezzo,
      postiDisponibili: this.postiDisponibili
    }
    //Richiamo la funzione che esegue la richiesta per inserire i dati nel database
    this.gestioneVoliService.Crea(datiVolo).subscribe({
      next: (response) => {
        console.log('Creation success:', response);
        //Sovrascrive eventuale messaggio di errore precedente
        this.creaVoloEsito = '';

        //Apertura dell'alert
        this.setOpenCreated(true);
      },
      error: (err) => {
        console.log('Creation error:', err);
        this.creaVoloEsito = err.error.message;
        //Messaggi di errore visualizzati dall'amministratore
        if(this.creaVoloEsito != 'Volo già presente!'){
          this.creaVoloEsito = "ERRORE: dati non validi!";
        }
      },
    });
  }

  //Funzione che gestisce la modifica di un volo
  ModificaVolo() {
    const oraP = this.formattaData(this.data, this.oraPartenza);
    const oraA = this.formattaData(this.data, this.oraArrivo);
    const datiVolo = {
      idVolo: this.idVolo,
      partenza: this.partenza,
      destinazione: this.destinazione,
      oraPartenza: oraP,
      oraArrivo: oraA,
      prezzo: this.prezzo,
      postiDisponibili: this.postiDisponibili
    }
    this.gestioneVoliService.Modifica(datiVolo).subscribe({
      next: (response) => {
        console.log('Modification success:', response);
        //Sovrascrive eventuale messaggio di errore precedente
        this.creaVoloEsito = '';

        //Apertura dell'alert
        this.setOpenModified(true);
      },
      error: (err) => {
        console.log('Modification error:', err);
        console.log('Impossibile modificare il volo, perché assente nel database!');
        this.creaVoloEsito = err.error.message;
        if(this.creaVoloEsito != 'Volo per la modifica non presente nel database!'){
          this.creaVoloEsito = "ERRORE: dati non validi!";
        }
      },
    });
  }
}