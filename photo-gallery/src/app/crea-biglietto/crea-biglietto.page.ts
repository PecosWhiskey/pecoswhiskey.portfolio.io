import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';
import {IonContent,IonHeader,IonTitle,IonToolbar,IonButtons,IonBackButton,IonButton,IonItem,IonInput,
  IonLabel,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonIcon} from '@ionic/angular/standalone';
import { Volo } from '../models/volo.models';
import { SessionStorageService } from '../services/session-storage.service';
import { BigliettiService } from '../services/biglietti.service';

@Component({
  selector: 'app-crea-biglietto',
  templateUrl: './crea-biglietto.page.html',
  styleUrls: ['./crea-biglietto.page.scss'],
  standalone: true,
  imports: [CommonModule,FormsModule,IonContent,IonHeader,IonTitle,IonToolbar,IonButtons,IonBackButton,
    IonButton,IonItem,IonInput,IonLabel,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonIcon]
})
export class CreaBigliettoPage implements OnInit {

  constructor(
    private location: Location,
    private sessionStorage: SessionStorageService,
    private bigliettiService: BigliettiService
  ) {
    addIcons({informationCircleOutline});
  }

  //Dati richiesti in fase di acquisto del biglietto
  idVolo = '';
  idPasseggero = '';
  nome = '';
  cognome = '';
  dataNascita = '';
  documentoID = '';
  tariffa = '';
  posto = '';
  dataPartenza = '';
  prezzoFinale = 0.0;
  dataAcquisto = '';

  //Variabili il cui valore cambia in base alle risposte del server alle richieste inviate
  richiestaEsito = '';
  bigliettoCreato = false;
  modificaEsito = '';
  passeggeroCreato = false;
  numBigliettiCreatiAndata = 0; //Tiene traccia del numero di biglietti creati
  numBigliettiCreatiRitorno = 0;

  numPasseggeri = 0; //numero di passeggeri selezionato dall'utente in fase di ricerca dei voli
  numeroPasseggeri : number[] = []; //array di lunghezza pari al numero di passeggeri, che viene utilizzato per il primo ciclo for presente nell'html
  passeggeri: any[] = []; //array che conterrà i dati dei passeggeri per cui verrà creato il biglietto

  //Dati ottenuti dai service
  bigliettoAndata : Volo = {
    idVolo: '', 
      partenza: '',
      destinazione: '',
      oraPartenza: '',
      oraArrivo: '',
      prezzo: 0.0,
      postiDisponibili: 0
  };

  bigliettoRitorno : Volo= {
    idVolo: '', 
      partenza: '',
      destinazione: '',
      oraPartenza: '',
      oraArrivo: '',
      prezzo: 0.0,
      postiDisponibili: 0
  };

  sceltaUtente=  '';

  //Array che memorizza ogni biglietto che viene inserito nel database
  bigliettiCreati: any[] = [];

  ngOnInit() {
    //Recupera i dati dei biglietti scelti dal service Biglietti
    this.bigliettiService.getBigliettoAndata().subscribe(biglietto => {
      if(this.valutaBiglietto(biglietto)){
        this.bigliettoAndata = biglietto;
      }  
    });

    this.bigliettiService.getBigliettoRitorno().subscribe(biglietto => {
      if(this.valutaBiglietto(biglietto)){
        this.bigliettoRitorno = biglietto;
      }  
    });
    //Recupera il numero di passeggeri dal Session Storage
    const passeggeri = this.sessionStorage.getItem('numero passeggeri');
    if(passeggeri != 0){
      this.numPasseggeri = passeggeri;
      console.log("Numero di passeggeri: ", this.numPasseggeri);
      this.numeroPasseggeri = Array.from({ length: passeggeri }, (_, i) => i + 1);
      //Richiamo alla funzione che inizializza l'array di oggetti, con i dati dei passeggeri, con valori nulli
      this.inizializzaPasseggeri();
    }
    //Recupera la scelta tra "Andata e ritorno" o "Solo Andata" dal Session Storage   
    const scelta = this.sessionStorage.getItem('sceltaUtente');
    if(scelta != null){
      this.sceltaUtente = scelta;
    }
    //Recupera il numero di biglietti creati dal service Biglietti
    this.bigliettiService.getnumBigliettiCreatiAndata().subscribe(numero => {
      this.numBigliettiCreatiAndata = numero;
    });

    this.bigliettiService.getnumBigliettiCreatiRitorno().subscribe(numero => {
      this.numBigliettiCreatiRitorno = numero;
    });

    console.log("Biglietto andata: ", this.bigliettoAndata);
    console.log("Biglietto ritorno: ", this.bigliettoRitorno);
  }

  //Quando si esce dalla pagina il numero di biglietti creati viene resettato
  ionViewWillLeave(){
    this.bigliettiService.resetBigliettiCreati();
  }

  //Funzione che verifica che i campi del biglietto non siano uguali a valori nulli
  valutaBiglietto(biglietto: Volo){
    return biglietto.idVolo != '' && biglietto.partenza != '' && biglietto.destinazione != '' && biglietto.oraPartenza != '' &&
    biglietto.oraArrivo != '' && biglietto.prezzo != 0.0 && biglietto.postiDisponibili != 0
  }

  //Funzione che inizializza un array di lunghezza pari al numero di passeggeri, con i dati da inserire nel form, a valori nulli
  inizializzaPasseggeri() {
    //Svuota l'array prima di inizializzare
    this.passeggeri = [];

    for (let i = 0; i < this.numPasseggeri; i++) {
      this.passeggeri.push({
        idPasseggero: '',
        nome: '',
        cognome: '',
        dataNascita: '',
        documentoID: '',
      });
    }
  }

  //Funzione che permette di creare il biglietto, ricevendo in input i dati del passeggero di cui viene confermata la creazione del biglietto
  Acquista(passeggero: any){
    console.log(passeggero);
    //Memorizzazione dei dati del passeggero nel database
    this.bigliettiService.CreaPasseggero(passeggero).subscribe({
      next: (response) => {
        console.log('Creation success:', response);
        this.passeggeroCreato= true;
        this.idPasseggero = response.data.idPasseggero;

        //Creato il passeggero procedo a creare il biglietto
        const data = new Date(); //ottengo la data corrente
        console.log("Data corrente: ", data);
        console.log("data in formato iso: ", data.toISOString());
        this.dataAcquisto = data.toISOString().split('T')[0]; //la traformo in formato ISO e ricavo solo la prima parte (YYYY-MM-DD)
        //Creazione del biglietto di andata
        const datiAndata = {
          idVolo: this.bigliettoAndata.idVolo,
          idPasseggero : this.idPasseggero,
          tariffa: this.tariffa,
          posto: this.posto,
          dataPartenza: this.bigliettoAndata.oraPartenza + " "+this.bigliettoAndata.oraArrivo.split(' ')[1],
          prezzoFinale: this.bigliettoAndata.prezzo,
          dataAcquisto: this.dataAcquisto
        }

        console.log("id volo biglietto andata: ", this.bigliettoAndata);
        console.log("ID VOLO: ", datiAndata.idVolo);

        //Richiamo la funzione per inserire i dati del biglietto nel database
        this.bigliettiService.CreaBiglietto(datiAndata).subscribe({
          next: (response) => {
            console.log('Creation success:', response);
            //Memorizzo il numero di biglietti creati nel BigliettiService
            this.numBigliettiCreatiAndata++;
            this.bigliettiService.setnumBigliettiCreatiAndata(this.numBigliettiCreatiAndata);
            console.log("Biglietti creati andata: ", this.bigliettiService.getnumBigliettiCreatiAndata());
            this.bigliettiCreati.push(response.data);
            console.log(this.bigliettiCreati);
            this.bigliettoCreato = true;


            //Creato il biglietto decremento dei posti disponibili per i voli di cui è stato acquistato un biglietto
            //Decremento per il volo di andata
            const postiNuovi = this.bigliettoAndata.postiDisponibili - this.numBigliettiCreatiAndata;
            const datiVolo = {
              idVolo: this.bigliettoAndata.idVolo,
              posti: postiNuovi
            }
            this.bigliettiService.ModificaVolo(datiVolo).subscribe({
              next: (response) => {
                console.log('Modification success:', response);
              },
               error: (err) => {
                console.log('Modification error:', err);
                this.richiestaEsito = err.error.message;
               },
            });
          },
           error: (err) => {
            console.log('Creation error:', err);
            //Messaggi di errore visualizzati dall'utente
            if(this.richiestaEsito == "Biglietto per questo passeggero e per questo volo già acquistato!"){
              //Personalizzo il messaggio specificando che il biglietto già acquistato è quello di andata
              this.richiestaEsito = "Biglietto di andata per questo passeggero e per questo volo già acquistato!";
            }else{
              this.richiestaEsito = "ERRORE: Dati per il biglietto di andata non validi!";
            }
           },
        });

        //Se il cliente ha anche acquistato il biglietto di ritorno
        if(this.valutaBiglietto(this.bigliettoRitorno)){
        //Creazione del biglietto di ritorno
          const datiRitorno = {
            idVolo: this.bigliettoRitorno.idVolo,
            idPasseggero : this.idPasseggero,
            tariffa: this.tariffa,
            posto: this.posto,
            dataPartenza: this.bigliettoRitorno.oraPartenza + " "+this.bigliettoRitorno.oraArrivo.split(' ')[1],
            prezzoFinale: this.bigliettoRitorno.prezzo,
            dataAcquisto: this.dataAcquisto
          }
          //Richiamo la funzione per inserire i dati del biglietto nel database  
          this.bigliettiService.CreaBiglietto(datiRitorno).subscribe({
            next: (response) => {
              console.log('Creation success:', response);      
              //Memorizzo il numero di biglietti creati nel BigliettiService
              this.numBigliettiCreatiRitorno++;
              this.bigliettiService.setnumBigliettiCreatiRitorno(this.numBigliettiCreatiRitorno);
              console.log("biglietti creati ritorno: ", this.bigliettiService.getnumBigliettiCreatiRitorno());
              this.bigliettiCreati.push(response.data);
              this.bigliettoCreato = true;

              //Decremento del numero di posti disponibili per il volo di ritorno
              const postiNuoviR = this.bigliettoRitorno.postiDisponibili - this.numBigliettiCreatiRitorno;
              const datiVoloR = {
                idVolo: this.bigliettoRitorno.idVolo,
                posti: postiNuoviR
              }
              this.bigliettiService.ModificaVolo(datiVoloR).subscribe({
                next: (response) => {
                  console.log('Modification success:', response);
                  this.modificaEsito = response.message;
                },
                 error: (err) => {
                  console.log('Modification error:', err);
                  this.modificaEsito = err.error.message;
                },
              })
            },
             error: (err) => {
              console.log('Creation error:', err);
              this.richiestaEsito = err.error.message;
              //Messaggi di errore visualizzati dall'utente
              if(this.richiestaEsito == "Biglietto per questo passeggero e per questo volo già acquistato!"){
                //Personalizzo il messaggio specificando che il biglietto già acquistato è quello di ritorno
                this.richiestaEsito = "Biglietto di ritorno per questo passeggero e per questo volo già acquistato!";
              }else{
                this.richiestaEsito = "ERRORE: Dati per il biglietto di ritorno non validi!";
              }
            },
          });
        }
      },
       error: (err) => {
        console.log('Creation error:', err);
        this.richiestaEsito = "ERRORE: Dati del passeggero non validi!";
        this.passeggeroCreato = false;

       },
    });
  }

  //Funzione per tornare alla pagina precedente
  goBack() {
    this.location.back();
  }
}
