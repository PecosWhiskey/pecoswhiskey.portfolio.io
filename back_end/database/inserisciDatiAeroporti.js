const { modificaBiglietto } = require('../models/biglietti');
const db = require('./dbBiglietti');

//Funzione per l'inserimento di una nuova Posizione
async function inserisciPosizione(citta, stato, latitudine, longitudine){
    try{
       return new Promise((resolve,reject)=>{
        db.run('INSERT INTO Posizione (citta, stato, latitudine, longitudine) VALUES (?, ?, ?, ?)',
            [citta, stato, latitudine, longitudine], function(err){
                if(err){
                    reject(err);
                    return;
                }
                resolve({idPosizione:this.lastID, citta, stato, latitudine, longitudine});
                console.log("Posizione creata con successo!");
                console.log({idPosizione:this.lastID, citta, stato, latitudine, longitudine})
            }
        );
       }); 
    }catch(err){
        console.log('Errore nella creazione della posizione; ', err.message);
    }
}

//Funzione per l'inserimento di un nuovo aeroporto
async function inserisciAeroporto(idAeroporto, nome, idPosizione){
    try{
        return new Promise((resolve,reject)=>{
            db.run('INSERT INTO Aeroporto VALUES (?,?,?)', [idAeroporto, nome, idPosizione], function(err){
                if(err){
                    reject(err);
                    return;
                }
                resolve({idAeroporto, nome, idPosizione});
                console.log("Aeroporto inserito con successo!");
                console.log({idAeroporto, nome, idPosizione});
            })
        })
    }catch(err){
        console.log("Errrore nell'inserimento dell'aeroporto: ", err.message);
    }
}

//Funzione per eliminare una posizione dal database
async function eliminaPosizione(id){
    try{
        return new Promise((resolve,reject)=>{
            db.run('DELETE FROM Posizione WHERE idPosizione=?',[id], (err)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve({idPosizione:id});
                console.log("Eliminazione avvenuta con successo!");
            })
        })
    }catch(err){
        console.log("Errore: ", err.message);
    }
}

//Funzione per eliminare un aeroporto dal database
async function eliminaAeroporto(id){
    try{
        return new Promise((resolve,reject)=>{
            db.run('DELETE FROM Aeroporto WHERE idAeroporto=?',[id], (err)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve({idAeroporto:id});
                console.log("Eliminazione avvenuta con successo!");
            })
        })
    }catch(err){
        console.log("Errore: ", err.message);
    }
}

//Funzione per visualizzare tutte le posizioni presenti nel database
async function visualizzaPosizione(){
    try{
        return new Promise((resolve,reject)=>{
            db.all('SELECT * FROM Posizione', (err,rows)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(rows);
                console.log(rows);
            })
        })
    }catch(err){
        console.log("Errore: ", err.message);
    }
}

//Funzione per visualizzare tutti gli aeroporti presenti nel database
async function visualizzaAeroporto(){
    try{
        return new Promise((resolve,reject)=>{
            db.all('SELECT * FROM Aeroporto', (err,rows)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(rows);
                console.log(rows);
            })
        })
    }catch(err){
        console.log("Errore: ", err.message);
    }
}

// async function visualizzaVoli(){
//     try{
//         return new Promise((resolve,reject)=>{
//             db.all('SELECT * FROM Volo', (err,rows)=>{
//                 if(err){
//                     reject(err);
//                     return;
//                 }
//                 resolve(rows);
//                 console.log(rows);
//             })
//         })
//     }catch(err){
//         console.log("Errore: ", err.message);
//     }
// }

// async function visualizzaClienti(){
//     try{
//         return new Promise((resolve,reject)=>{
//             db.all('SELECT * FROM Cliente', (err,rows)=>{
//                 if(err){
//                     reject(err);
//                     return;
//                 }
//                 resolve(rows);
//                 console.log(rows);
//             })
//         })
//     }catch(err){
//         console.log("Errore: ", err.message);
//     }
// }

// async function visualizzaBiglietti(){
//     try{
//         return new Promise((resolve,reject)=>{
//             db.all('SELECT * FROM Biglietto', (err,rows)=>{
//                 if(err){
//                     reject(err);
//                     return;
//                 }
//                 resolve(rows);
//                 console.log(rows);
//             })
//         })
//     }catch(err){
//         console.log("Errore: ", err.message);
//     }
// }

// async function visualizzaBigliettiID(idPasseggero){
//     try{
//         return new Promise((resolve,reject)=>{
//             db.all('SELECT * FROM Biglietto WHERE idPasseggero=?', [idPasseggero], (err,rows)=>{
//                 if(err){
//                     reject(err);
//                     return;
//                 }
//                 resolve(rows);
//                 console.log(rows);
//             })
//         })
//     }catch(err){
//         console.log("Errore: ", err.message);
//     }
// }

// async function modificaPasseggero({idPasseggeroCorrente, idPasseggeroModificato, nome, cognome, dataNascita, documentoID}){
//             return new Promise((resolve,reject)=>{
//                 db.run('UPDATE Passeggero SET idPasseggero=?, nome=?, cognome=?, dataNascita=?, documentoID=? WHERE idPasseggero = ?', 
//                     [idPasseggeroModificato, nome, cognome, dataNascita, documentoID, idPasseggeroCorrente], function(err){
//                         if(err){
//                             reject(err);
//                             return;
//                         }
//                         resolve({idPasseggero, nome, cognome, dataNascita, documentoID});
//                     });
//             });
//     }

// async function modificaBigliettoPosto({idVolo, idPasseggero, posto}){
//             return new Promise((resolve,reject)=>{
//                 db.run('UPDATE Biglietto SET posto=? WHERE idVolo = ? AND idPasseggero=?', 
//                     [posto, idVolo, idPasseggero], function(err){
//                         if(err){
//                             reject(err);
//                             return;
//                         }
//                         resolve({idVolo, idPasseggero, posto});
//                     });
//             });
//     }    

// async function visualizzaPasseggeri(){
//     try{
//         return new Promise((resolve,reject)=>{
//             db.all('SELECT * FROM Passeggero', (err,rows)=>{
//                 if(err){
//                     reject(err);
//                     return;
//                 }
//                 resolve(rows);
//                 console.log(rows);
//             })
//         })
//     }catch(err){
//         console.log("Errore: ", err.message);
//     }
// }