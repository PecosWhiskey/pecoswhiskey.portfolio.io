export class Passeggero {
    idPasseggero: string;
    nome: string;
    cognome: string;
    dataNascita: string;
    documentoID: string;

    constructor(idPasseggero='', nome='', cognome='', dataNascita='', documentoID=''){
            this.idPasseggero = idPasseggero;
            this.nome = nome;
            this.cognome = cognome;
            this.dataNascita = dataNascita;
            this.documentoID = documentoID;
        }
}