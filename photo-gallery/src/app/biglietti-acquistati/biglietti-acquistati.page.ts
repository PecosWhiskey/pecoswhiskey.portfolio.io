import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent, IonBadge, IonIcon,IonButton, IonCardTitle, IonCard, IonCardHeader, IonCardContent, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { ClientiService } from '../services/clienti.service';
import { TokenService } from '../services/token.service';
import { Biglietto } from '../models/biglietto.models';
import { RouterModule, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { createOutline, listOutline, addCircleOutline, personOutline, ticketOutline, airplaneOutline,
  calendarOutline, timeOutline, peopleOutline, cardOutline, locationOutline, calendar, pricetagOutline, informationCircleOutline, searchOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-biglietti-acquistati',
  templateUrl: './biglietti-acquistati.page.html',
  styleUrls: ['./biglietti-acquistati.page.scss'],
  standalone: true,
  imports: [IonBadge,IonIcon,IonButton,IonCardTitle,IonCard,IonCardHeader,IonCardContent,IonContent,
    IonHeader,IonToolbar,CommonModule,FormsModule,RouterModule,RouterLink]
})
export class BigliettiAcquistatiPage implements OnInit {

  //Informazioni del cliente che accede alla pagina memorizzate nel LocalStorage
  idCliente = '';
  clientInfo!: any;
  //Array dei biglietti acquistati dal cliente
  biglietti: Biglietto[] = [];

  richiestaEsito = '';

  constructor(private clientiService: ClientiService, private tokenService: TokenService) {
    addIcons({informationCircleOutline, createOutline, listOutline, addCircleOutline, personOutline, ticketOutline, airplaneOutline,
      calendarOutline, timeOutline, peopleOutline, cardOutline, locationOutline, calendar, pricetagOutline, searchOutline, checkmarkCircleOutline});
  }

  ngOnInit(){
    //Caricamento dei biglietti acquistati
    this.caricaBiglietti();
  }

  //Funzione che permette di ottenere i biglietti acquistati direttamente dal database
  caricaBiglietti(){
    //Ottengo l'idCliente che serve per inviare la richiesta al server
    this.clientInfo = this.tokenService.getClientInfo();
    this.idCliente = this.clientInfo.idCliente;

    this.clientiService.CercaBiglietti({idCliente : this.idCliente}).subscribe({
      next: (response) => {
        console.log("Search success: ", response);
        this.biglietti = response.data;
      },
       error: (err) => {
        console.log("Search error: ", err);
        //Messaggio visualizzato dal cliente in caso di errore
        this.richiestaEsito = "Non è possibile visualizzare i biglietti acquistati!";
       }
    })
  }

  
  //Funzione che approssima il prezzo finale del biglietto modificato mostrato
  Approssima(prezzo: number): number {
    return Math.round(prezzo * Math.pow(10, 2)) / Math.pow(10, 2);
  }
}
