const db = require('../database/dbBiglietti.js');
const bcrypt = require('bcryptjs');

class Biglietti {

    //Funzione per la creazione di un nuovo volo
    static async creaVolo({idVolo, partenza, destinazione, oraPartenza, oraArrivo, prezzo, postiDisponibili}){
        return new Promise((resolve,reject)=>{
            db.run(`INSERT INTO Volo (idVolo, partenza, destinazione, oraPartenza, oraArrivo, prezzo, postiDisponibili) VALUES (?,?,?,?,?,?,?)`, 
                [idVolo, partenza, destinazione, oraPartenza, oraArrivo, prezzo, postiDisponibili],
                function (err){
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve({idVolo, partenza, destinazione, oraPartenza, oraArrivo, prezzo, postiDisponibili});
                }
            );
        });
    }

    //Funzione per la modifica di un volo già presente nel database
    static async modificaVolo({idVolo, partenza, destinazione, oraPartenza, oraArrivo, prezzo, postiDisponibili}){
            return new Promise((resolve,reject)=>{
                db.run('UPDATE Volo SET partenza=?, destinazione=?, oraPartenza=?, oraArrivo=?, prezzo=?, postiDisponibili=? WHERE idVolo = ?', 
                    [partenza, destinazione, oraPartenza, oraArrivo, prezzo, postiDisponibili, idVolo], function(err){
                        if(err){
                            reject(err);
                            return;
                        }
                        resolve({idVolo, partenza, destinazione, oraPartenza, oraArrivo, prezzo, postiDisponibili});
                    });
            });
    }
     
    //Funzione per l'aggiornamento del numero di posti disponibili per un volo (decrementato ogni volta che viene acquistato un biglietto)
    static async decrementaPostiDisponibili({idVolo, posti}){
        return new Promise((resolve,reject)=>{
            db.run('UPDATE Volo SET postiDisponibili=? WHERE idVolo=?', [posti, idVolo], function(err){
                if(err){
                    reject(err);
                    return;
                }
                resolve({idVolo, posti});
            } )
        })
    }

    //Funzione per la ricerca nel database di un volo con specifiche caratteristiche (in fase di creazione di un volo)
    static async verificaEsistenzaVolo({idAeroportoPartenza, idAeroportoDestinazione, oraPartenza, oraArrivo}){
        return new Promise((resolve,reject)=>{
            db.get(`SELECT COUNT(*) as count FROM Volo WHERE partenza = ? AND destinazione = ?
                AND oraPartenza = ? AND oraArrivo = ?`, [idAeroportoPartenza, idAeroportoDestinazione, oraPartenza, oraArrivo],
                (err,row)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(row.count);
                });
        });
    }

    //Funzione per la ricerca di un volo in base ai dati inseriti dall'utente
    static async ricercaVolo({partenza, destinazione, oraPartenza}){
        //oraInizio e oraFine permettono di cercare i voli disponibili in tutte le 24 ore del giorno cercato
        const oraInizio = oraPartenza + " 00:00:00";
        const oraFine = oraPartenza + " 23:59:59";
        return new Promise((resolve,reject)=>{
            db.all(`SELECT * FROM Volo WHERE postiDisponibili > 0 AND oraPartenza>=? AND oraPartenza<=? AND partenza IN 
                (SELECT idAeroporto FROM Aeroporto WHERE idPosizione IN (
                SELECT idPosizione FROM Posizione WHERE citta = ?)) AND destinazione IN (
                SELECT idAeroporto FROM Aeroporto WHERE idPosizione IN(
                SELECT idPosizione FROM Posizione WHERE citta=?))`, 
                [oraInizio, oraFine, partenza, destinazione], (err,rows)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(rows);
                }
            )
        })
    }

    //Funzione per la ricerca di un volo dato il suo ID
    static async findByIdVolo(idVolo){
        return new Promise((resolve,reject)=>{
            db.get('SELECT * FROM Volo WHERE idVolo = ?', [idVolo], (err,row)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    }

    //Funzione per la ricerca della città di partenza del volo (in fase di modifica del biglietto eseguita al momento del check-in)
    static async trovaCittàPartenza(idVolo){
        return new Promise((resolve,reject)=>{
            db.get(`SELECT citta FROM Posizione WHERE idPosizione IN(
                SELECT idPosizione FROM Aeroporto WHERE idAeroporto IN(
                SELECT partenza FROM Volo WHERE idVolo = ?))`, [idVolo], (err,row)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(row);
                });

        });
    }

    //Funzione per la ricerca della città di destinazione del volo (in fase di modifica del biglietto eseguita al momento del check-in)
    static async trovaCittàDestinazione(idVolo){
        return new Promise((resolve,reject)=>{
            db.get(`SELECT citta FROM Posizione WHERE idPosizione IN(
                SELECT idPosizione FROM Aeroporto WHERE idAeroporto IN(
                SELECT destinazione FROM Volo WHERE idVolo = ?))`, [idVolo], (err,row)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(row);
                });
        });
    }

    //Funzione per la ricerca dell'aeroporto di partenza del volo (in fase di modifica del biglietto eseguita al momento del check-in)
    static async trovaAeroportoPartenza(idVolo){
        return new Promise((resolve,reject)=>{
            db.get(`SELECT idAeroporto, nome FROM Aeroporto WHERE idAeroporto IN(
                SELECT partenza FROM Volo WHERE idVolo=?)`, [idVolo], (err,row)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(row);
                });
        });
    }

    //Funzione per la ricerca dell'aeroporto di destinazione del volo (in fase di modifica del biglietto eseguita al momento del check-in)
    static async trovaAeroportoDestinazione(idVolo){
        return new Promise((resolve,reject)=>{
            db.get(`SELECT idAeroporto, nome FROM Aeroporto WHERE idAeroporto IN(
                SELECT destinazione FROM Volo WHERE idVolo=?)`, [idVolo], (err,row)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(row);
                });
        });
    }

    //Funzione per la creazione di un nuovo biglietto (in fase di acquisto del biglietto)
    static async creaBiglietto({idVolo, idPasseggero, tariffa, posto, dataPartenza, prezzoFinale, dataAcquisto}){
        return new Promise((resolve,reject)=>{
            db.run(`INSERT INTO Biglietto (idVolo, idPasseggero, tariffa, posto, dataPartenza, prezzoFinale, dataAcquisto) VALUES (?,?,?,?,?,?,?)`, 
                [idVolo, idPasseggero, tariffa, posto, dataPartenza, prezzoFinale, dataAcquisto],
                function (err){
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve({idBiglietto:this.lastID, idVolo, idPasseggero, tariffa, posto, dataPartenza, prezzoFinale, dataAcquisto});
                }
            );
        });
    }

    //Funzione per la modifica della tariffa e del posto a sedere presenti in un biglietto (in fase di check-in)
    static async modificaBiglietto({idBiglietto, tariffa, posto, prezzoFinale}){
        return new Promise((resolve,reject)=>{
            db.run("UPDATE Biglietto SET tariffa=?, posto=?, prezzoFinale=? WHERE idBiglietto=?", [tariffa, posto, prezzoFinale, idBiglietto], function(err){
                if(err){
                    reject(err);
                    return;
                }
                resolve({idBiglietto, tariffa, posto, prezzoFinale});
            })
        })
    }

    //Funzione che ricava tutti i posti scelti dai clienti che hanno effettuato il check-in
    static async ottieniPostiOccupati(idVolo){
        return new Promise((resolve,reject)=>{
            db.all("SELECT posto FROM Biglietto WHERE idVolo=? AND posto <> '' ", [idVolo], (err,rows)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(rows);
            })
        })
    }
    
    //Funzione che conta il numero di biglietti acquistati per un determinato volo (in fase di ricerca dei posti occupati)
    static async findTicketsByIdVolo(idVolo){
        return new Promise((resolve,reject)=>{
            db.get('SELECT COUNT(*) AS count FROM Biglietto WHERE idVolo = ?', [idVolo], (err,row)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(row.count);
            })
        })
    }

    //Funzione che trova i biglietti usando l'ID del cliente che li ha acquistati
    static async restituisciBiglietti(idCliente){
        return new Promise((resolve,reject)=>{
            db.all('SELECT * FROM Biglietto WHERE idPasseggero=?', [idCliente], (err,rows)=>{
                if(err){
                    reject (err);
                    return;
                }
                resolve(rows);
            })
        })
    }

    //Funzione che restituice tutti i biglietti che sono stati acquistati per farli visualizzare all'amministratore
    static async restituisciBigliettiAdmin(){
        return new Promise((resolve,reject)=>{
            db.all('SELECT * FROM Biglietto', (err,rows)=>{
                if(err){
                    reject (err);
                    return;
                }
                resolve(rows);
            })
        })
    }
    
    //Funzione che restituisce tutti i voli disponibili da far visualizzare all'amministratore
    static async findForAdmin(){
        return new Promise((resolve,reject)=>{
            db.all('SELECT * FROM Volo', (err,rows)=>{
                if(err){
                    reject (err);
                    return;
                }
                resolve(rows);
            })
        })
    }

    //Funzione che ricerca un biglietto tramite idPasseggero e idVolo (in fase di creazione di un nuovo biglietto)
    static async trovaBiglietto(idPasseggero, idVolo){
        return new Promise((resolve,reject)=>{
            db.get('SELECT * FROM Biglietto WHERE idPasseggero=? AND idVolo=?', [idPasseggero, idVolo], (err,row)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(row);
            })
        })
    }

    //Funzione che trova il biglietto per id passeggero e id biglietto (in fase di ricerca del biglietto per eseguire il check-in)
    static async findForCheckIn({idPasseggero, idBiglietto}){
        return new Promise((resolve,reject)=>{
            db.get('SELECT * FROM Biglietto WHERE idPasseggero=? AND idBiglietto=?', [idPasseggero, idBiglietto], (err,row)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(row);
            })
        })
    }
    
    //Funzione che ricerca un biglietto tramite il suo id (in fase di modifica del biglietto eseguita al momento del check-in)
    static async findTicketById(idBiglietto){
        return new Promise((resolve,reject)=>{
            db.get('SELECT * FROM Biglietto WHERE idBiglietto=?', [idBiglietto], (err,row)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(row);
            })
        })
    }

    //Funzione che inserisce i dati di un nuovo passeggero nel database (in fase di acquisto di un biglietto)
    static async creaPasseggero({idPasseggero, nome, cognome, dataNascita, documentoID}){
        return new Promise((resolve,reject)=>{
            db.run(`INSERT INTO Passeggero (idPasseggero, nome, cognome, dataNascita, documentoID) VALUES (?,?,?,?,?)`, 
                [idPasseggero, nome, cognome, dataNascita, documentoID],
                function (err){
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve({idPasseggero, nome, cognome, dataNascita, documentoID});
                }
            );
        });
    }

    //Funzione che ricerca un passeggero (in fase di creazione di un nuovo passeggero)
    static async cercaPasseggero({idPasseggero, nome, cognome, dataNascita, documentoID}){
        return new Promise((resolve,reject)=>{
            db.get('SELECT * FROM Passeggero WHERE idPasseggero=? AND nome=? AND cognome=? AND dataNascita=? AND documentoID=?', [idPasseggero, nome, cognome, dataNascita, documentoID], (err,row)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(row);
            })
        })
    }

    //Funzione per la ricerca del passeggero (in fase di modifica del biglietto eseguita al momento del check-in)
    static async trovaPasseggeroForCheckIn({idBiglietto, idPasseggero}){
        return new Promise((resolve,reject)=>{
            db.get(`SELECT nome, cognome FROM Passeggero WHERE idPasseggero IN(
                SELECT idPasseggero FROM Biglietto WHERE idBiglietto=? AND idPasseggero=?)`, [idBiglietto, idPasseggero], (err,row)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(row);
                })
        })
    }

   //Funzione per inserire un nuovo cliente (in fase di registrazione)
   static async creaCliente({idCliente, nome, cognome, dataNascita, documentoID, sesso, nazionalita, stato, citta, CAP, indirizzo, numCivico, email, password}){
        //Hashing della password prima di inserirla nel database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        return new Promise((resolve,reject)=>{
            db.run(`INSERT INTO Cliente (idCliente, nome, cognome, dataNascita, documentoID, sesso, nazionalita, 
                stato, citta, CAP, indirizzo, numeroCivico, email, password) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, 
                [idCliente, nome, cognome, dataNascita, documentoID, sesso, nazionalita, stato, citta, CAP, indirizzo, numCivico, email, hashedPassword],
                function (err){
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve({idCliente, nome, cognome, dataNascita, documentoID, sesso, nazionalita, stato, citta, CAP, indirizzo, numCivico, email});
                }
            );
        });
    } 

    //Funzione di ricerca del cliente tramite email (in fase di registrazione)
    static async findByEmail(email) {
     console.log("findbyEmail", email);
     return new Promise((resolve, reject) => {
        db.get('SELECT * FROM Cliente WHERE email = ?', [email], (err, row) => {
          if (err){
            return reject(err);
          }
          resolve(row);
        });
      }); 
    }

    //Funzione di ricerca del Cliente utilizzando il suo ID
//     static async findByIdCliente(idCliente) {
//     return new Promise((resolve, reject) => {
//       db.get(`SELECT idCliente, nome, cognome, dataNascita, documentoID, sesso, nazionalita, 
//                 stato, citta, CAP, indirizzo, numeroCivico, email FROM Cliente WHERE idCliente = ?`, [idCliente], (err, row) => {
//         if (err){
//           return reject(err);
//         } 
//         resolve(row);
//       });
//     });
//   }

    //Funzione che verifica la correttezza della password inserita nel login
    static async comparePassword(candidatePassword, hash) {
        return bcrypt.compare(candidatePassword, hash);
      }
}

module.exports = Biglietti;