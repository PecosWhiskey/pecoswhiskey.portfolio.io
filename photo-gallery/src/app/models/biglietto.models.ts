export class Biglietto{
    idBiglietto?: number;
    idVolo: string;
    idPasseggero : string;
    tariffa: string;
    posto: string;
    dataPartenza: string;
    prezzoFinale: number;
    dataAcquisto: string;

    constructor(idVolo='', idP = '', tariffa = '', posto='', dataP= '', prezzo= 0.0, dataA= ''){
        this.idVolo=idVolo;
        this.idPasseggero = idP;
        this.tariffa = tariffa;
        this.posto = posto;
        this.dataPartenza = dataP;
        this.prezzoFinale = prezzo;
        this.dataAcquisto = dataA;
    }
}
