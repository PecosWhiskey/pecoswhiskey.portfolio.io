export class RicercaInfo{
    partenza: string;
    destinazione: string;
    dataPartenza: string;
    dataRitorno: string;

    constructor(partenza='', destinazione='', dataP='', dataR=''){
        this.partenza=partenza;
        this.destinazione=destinazione;
        this.dataPartenza=dataP;
        this.dataRitorno=dataR;
    }
}