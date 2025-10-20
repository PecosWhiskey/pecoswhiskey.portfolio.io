import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonHeader,IonToolbar,IonCardContent,IonCardHeader,IonCard,IonCardTitle,IonButton,IonIcon,IonBadge} from '@ionic/angular/standalone';
import { GestioneVoliService } from '../gestione-voli/gestione-voli.service';
import { Biglietto } from '../models/biglietto.models';
import { RouterModule, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { createOutline, listOutline, addCircleOutline, personOutline, ticketOutline, airplaneOutline,
  calendarOutline, timeOutline, peopleOutline, cardOutline, locationOutline, calendar, pricetagOutline, informationCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-prenotazioni',
  templateUrl: './prenotazioni.page.html',
  styleUrls: ['./prenotazioni.page.scss'],
  standalone: true,
  imports: [ IonBadge,IonIcon,IonButton,IonCardTitle,IonCard,IonCardHeader,IonCardContent,
    IonContent,IonHeader,IonToolbar,CommonModule,FormsModule,RouterModule,RouterLink]
})
export class PrenotazioniPage implements OnInit {

  biglietti: Biglietto[] = [];

  richiestaEsito = '';

  constructor(private gestioneVoliService: GestioneVoliService) {
    addIcons({ createOutline, listOutline, addCircleOutline, personOutline, ticketOutline, airplaneOutline,
      calendarOutline, timeOutline, peopleOutline, cardOutline, locationOutline, pricetagOutline, calendar, informationCircleOutline});
  }

  ngOnInit(): void {
    //Caricamento dei biglietti
    this.caricaPrenotazioni();
  }

  //Funzione che permette di ottenere le prenotazioni dei voli ricevute direttamente dal database
  caricaPrenotazioni(){
    this.gestioneVoliService.CercaBigliettiAcquistati().subscribe({
      next: (response) => {
        console.log("Search success: ", response);
        this.biglietti = response.data;
      },
        error: (err) => {
          console.log("Search error: ", err);
          this.richiestaEsito = err.error.message;
          //Messaggi visualizzati dall'amministratore
          if(this.richiestaEsito != "Non ci sono biglietti acquistati!"){
            this.richiestaEsito = "ERRORE: Non è possibile visualizzare le prenotazioni ricevute!";
          }
       }
    })
  }

  //Funzione che approssima il prezzo finale del biglietto modificato mostrato
  Approssima(prezzo: number): number {
    return Math.round(prezzo * Math.pow(10, 2)) / Math.pow(10, 2);
  }
}
