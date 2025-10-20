export class Cliente {
    idCliente: string;
    nome: string;
    cognome: string;
    dataNascita: string;
    documentoID: string;
    sesso: string;
    nazionalita: string;
    stato: string;
    citta: string;
    CAP: string;
    indirizzo: string;
    numCivico: number;
    email: string;
    password: string;

    constructor(idCliente='', nome='', cognome='', dataNascita='', documentoID='', sesso='', 
        nazionalita='', stato='', citta='', CAP='', indirizzo='', numCivico=0, email='', password=''){
            this.idCliente = idCliente;
            this.nome = nome;
            this.cognome = cognome;
            this.dataNascita = dataNascita;
            this.documentoID = documentoID;
            this.sesso = sesso;
            this.nazionalita = nazionalita;
            this.stato = stato;
            this.citta = citta;
            this.CAP = CAP;
            this.indirizzo = indirizzo;
            this.numCivico = numCivico;
            this.email = email;
            this.password = password;
        }
}