export class Volo{
    idVolo: string;
    partenza: string;
    destinazione: string;
    oraPartenza: string;
    oraArrivo: string;
    prezzo: number;
    postiDisponibili: number;

    constructor(idVolo='', partenza='', destinazione='', oraP='', oraA='', prezzo=0.0, posti=0){
        this.idVolo=idVolo;
        this.partenza=partenza;
        this.destinazione=destinazione;
        this.oraPartenza=oraP;
        this.oraArrivo=oraA;
        this.prezzo=prezzo;
        this.postiDisponibili=posti;
    }
}