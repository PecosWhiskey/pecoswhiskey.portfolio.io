const biglietti = require('../../models/biglietti.js');

class AuthServiceBiglietti {

    //Creazione di un nuovo volo
    static async generaVolo(datiVolo){
        try{
            const data = {
                idAeroportoPartenza: datiVolo.partenza,
                idAeroportoDestinazione: datiVolo.destinazione,
                oraPartenza: datiVolo.oraPartenza,
                oraArrivo: datiVolo.oraArrivo,
            }
            //Verifica se un volo con questi dati è già presente nel database
            const exist = await biglietti.verificaEsistenzaVolo(data);

            if(exist > 0){
                //Se presente non viene creato nessun volo
                throw new Error('Volo già presente!');
            }
            //Se non presente vengono inseriti i dati del nuovo volo nel database
            return await biglietti.creaVolo(datiVolo);
        }catch (err){
            console.log("ERRORE SERVICE BIGLIETTI: ", err.message);
            throw err;
        }
    }

    //Modifica di un volo
    static async modificaVoli(datiVolo){
        try{
            //Verifica se il volo è presente nel database
            const volo = await biglietti.findByIdVolo(datiVolo.idVolo);

            if(!volo){
                //Se non presente non può essere modificato, dunque viene lanciato un errore
                throw new Error('Volo per la modifica non presente nel database!');
            }
            //Se presente vengono aggiornati i dati del volo con quelli nuovi inseriti in input
            return await biglietti.modificaVolo(datiVolo);
        }catch(err){
            console.log('ERRORE SERVICE BIGLIETTI: ', err.message);
            throw err;
        }
    }

    //Decremento posti disponibili in un volo
    static async decrementaPosti(dati){
        try{
            //Verifica se il volo è presente nel database
            const volo= await biglietti.findByIdVolo(dati.idVolo);

            if(!volo){
                //Se non presente il numero di posti disponibili non può essere decrementato, dunque viene lanciato un errore
                throw new Error("Volo per l'aggiornamento dei posti disponibili inesistente");
            }
            //Se presente viene aggiornato il numero di posti disponibili nel volo
            return await biglietti.decrementaPostiDisponibili(dati);
        }catch(err){
            console.log("ERRORE SERVICE BIGLIETTI: ", err.message);
            throw err;
        }
    }

    //Ricerca di un volo
    static async cercaVolo(datiVolo){
        try{
            //Ricerca del volo nel database
           const exist = await biglietti.ricercaVolo(datiVolo);

           if(!exist){
            throw new Error('Nessun volo trovato in cercaVolo!');
           }
           return exist; 
        }catch(err){
            console.log("ERRORE SERVICE BIGLIETTI: ", err.message);
            throw err;
        } 
    }

    //Registrazione di un cliente
    static async registrazioneCliente(datiCliente){
        try{
            //Verifica che la stessa email non appartenga già ad un altro cliente registrato
            const exist= await biglietti.findByEmail(datiCliente.email);

            if(exist){
                //Se viene trovata non si può proseguire con la creazione del cliente, perché l'email deve essere univoca
                throw new Error('Email già in uso!');
            }
            //Se non viene trovata si procede ad inserire i dati del nuovo cliente nel database
            return await biglietti.creaCliente(datiCliente);
        }catch(err){
            console.log("ERRORE SERVICE BIGLIETTI: ", err.message);
            throw err;
        }
    }

    //Login di un cliente
    static async loginCliente(credenziali){
        try{
            //Verifica se il cliente è registrato usando la sua email per ricercarlo nel database, essendo univoca
            const cliente = await biglietti.findByEmail(credenziali.email);
            
            if(!cliente){
                //Se il cliente non viene trovato le credenziali non sono sicuramente valide e non è neccessario proseguire oltre
                throw new Error('Credenziali non valide!');
            }
            //Verifica se la password è corretta
            const pass = await biglietti.comparePassword(credenziali.password, cliente.password);

            if(!pass){
                //Se non è corretta le credenziali non sono valide
                throw new Error('Credenziali non valide!');
            }
            //Vengono restituiti tutti i dati del cliente
            return cliente;
        }catch(err){
            console.log("ERRORE SERVICE BIGLIETTI: ", err.message);
            throw err;
        }
    }

    //Creazione biglietto
    static async createBiglietto(datiBiglietto){
        try{
            //Verifica se il passeggero ha già acquistato un biglietto per un determinato volo
            const exist = await biglietti.trovaBiglietto(datiBiglietto.idPasseggero, datiBiglietto.idVolo);

            if(exist){
                //Se viene trovato viene impedito l'acquisto di un altro biglietto
                throw new Error('Biglietto per questo passeggero e per questo volo già acquistato!');
            }
            //Se non viene trovato allora vengono inseriti nel database i dati del nuovo biglietto
            return await biglietti.creaBiglietto(datiBiglietto);
        }catch(err){
            console.log("ERRORE SERVICE BIGLIETTI: ", err.message);
            throw err;
        }
    }

    //Modifica di un biglietto
    static async modificaTicket(dati){
        try{
            //Verifica se il biglietto è presente nel database
            const biglietto = await biglietti.findTicketById(dati.idBiglietto);

            if(!biglietto){
                //Se non presente nel database non può essere modificato, dunque viene lanciato un errore
                throw new Error('Nessun biglietto da modificare trovato')
            }
            //Modifica dei dati del biglietto con quelli nuovi inseriti in input
            const modificato = await biglietti.modificaBiglietto(dati);

            if(!modificato){
                throw new Error('Errore nella modifica del biglietto');
            }
            //Vengono ricavate altre informazioni necessarie del volo per cui è stato acquistato il biglietto appena modificato
            const passeggero = await biglietti.trovaPasseggeroForCheckIn({idBiglietto: biglietto.idBiglietto, idPasseggero:biglietto.idPasseggero});
            const partenza = await biglietti.trovaCittàPartenza(biglietto.idVolo);
            const destinazione = await biglietti.trovaCittàDestinazione(biglietto.idVolo);
            const aeroportoPartenza = await biglietti.trovaAeroportoPartenza(biglietto.idVolo);
            const aeroportoDestinazione = await biglietti.trovaAeroportoDestinazione(biglietto.idVolo);

            const risultato = {
                idBiglietto: modificato.idBiglietto, 
                idVolo: biglietto.idVolo, 
                nomePasseggero: passeggero.nome,
                cognomePasseggero: passeggero.cognome,
                partenza: partenza.citta,
                destinazione: destinazione.citta,
                aeroportoPartenza: aeroportoPartenza,
                aeroportoDestinazione : aeroportoDestinazione,
                tariffa: modificato.tariffa,
                posto: modificato.posto,
                dataPartenza: biglietto.dataPartenza,
                prezzoFinale: modificato.prezzoFinale
            }

            return risultato;
        }catch(err){
            console.log('ERRORE SERVICE BIGLIETTI: ', err.message);
            throw err;
        }
    }

    //Posti occupati
    static async getPostiOccupati(dati){
        try{
            //Conta il nuomero di biglietti acquistati per un determinato volo
            const numero = await biglietti.findTicketsByIdVolo(dati.idVolo);

            if(numero == 0){
                //Se non sono stati acquistati biglietti non è necessario proseguire nella ricerca, dunque viene lanciato un errore
                throw new Error("Non sono stati acquistati biglietti per questo volo!");
            }
            //Se sono stati acquistati biglietti vengono cercati tutti i posti già occupati da altri passeggeri
            return await biglietti.ottieniPostiOccupati(dati.idVolo);
        }catch(err){
            console.log('ERRORE SERVICE BIGLIETTI: ', err.message);
            throw err;
        }
    }

    //Ricerca dei biglietti del cliente autenticato
    static async returnBiglietti(idCliente){
        try{
            //Ricerca dei biglietti del cliente che si è registrato
            const exist = await biglietti.restituisciBiglietti(idCliente);

            if(!exist){
                throw new Error('Non ci sono biglietti acquistati per questo cliente!');
            }

            return exist;
        }catch(err){
            console.log('ERRORE SERVICE BIGLIETTI: ', err.message);
            throw err;
        }
    }

    //Ricerca dei biglietti per l'amministratore
    static async returnBigliettiAdmin(){
        try{
            //Ricerca di tutti i biglietti presenti nel database
            const exist = await biglietti.restituisciBigliettiAdmin();

            if(!exist){
                throw new Error('Non ci sono biglietti acquistati!');
            }

            return exist;
        }catch(err){
            console.log('ERRORE SERVICE BIGLIETTI: ', err.message);
            throw err;
        }
    }

    //Ricerca dei voli disponibili per l'amministratore
    static async returnForAdmin(){
        try{
            //Ricerca di tutti i voli disponibili presenti nel database
            const exist = await biglietti.findForAdmin();

            if(!exist){
                throw new Error('Non ci sono voli disponibili');
            }

            return exist;
        }catch(err){
            console.log('ERRORE SERVICE BIGLIETTI: ', err.message);
            throw err;
        }
    }

    //Ricerca del biglietto acquistato da un passeggero per il check-in
    static async returnForCheckIn(dati){
        try{
            //Verifica che il biglietto è stato acquistato
            const exist = await biglietti.findForCheckIn(dati);

            if(!exist){
                //Se non è stato acquistato nessun biglietto non può essere effettuto il check-in, dunque viene restituito un errore
                throw new Error('Non ci sono biglietti acquistati!');
            }

            if(exist.posto != '' || exist.tariffa != ''){
                //Se la tariffa e il posto sono stati già cambiati non possono essere più modificati, dunque viene restiuito un errore
                throw new Error('Check-in già fatto!');
            }

            return exist;
        }catch(err){
            console.log('ERRORE SERVICE BIGLIETTI: ', err.message);
            throw err;
        }
    }

    //Creazione passeggero
    static async createPasseggero(datiPasseggero){
        try{
            //Verifica se il passeggero è già presente nel database
            const exist = await biglietti.cercaPasseggero(datiPasseggero);

            if(exist){
                //Se presente vengono restituiti i dati già memorizzati
                return exist; 
            }                 
            //Se non presente vengono inseriti i dati del nuovo passeggero nel database
            return await biglietti.creaPasseggero(datiPasseggero);
        }catch(err){
            console.log('ERRORE SERVICE BIGLIETTI: ', err.message);
            throw err;
        }
    }
}

module.exports = AuthServiceBiglietti;