const bigliettiService = require('../authService/authServiceBiglietti');
const jwt = require('jsonwebtoken'); //modulo che crea e verifica i token JWT

class AuthControllerBiglietti {
    //RISPOSTA RICHIESTA CREAZIONE VOLO
    static async voloCreation(req,res){
        console.log('voloCreation: ',req.body);
        try{
            const created = await bigliettiService.generaVolo(req.body);
            res.status(201).json({
                succes: true,
                data: created
            });
        } catch(err){
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }
  
    //RISPOSTA RICHIESTA MODIFICA VOLO
    static async voloModification(req,res){
        console.log('voloModification: ',req.body);
        try{
            const created = await bigliettiService.modificaVoli(req.body);
            res.status(201).json({
                succes: true,
                data: created
            });
        } catch(err){
            res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }

    //RISPOSTA RICHIESTA DECREMENTO POSTI
    static async decreseSeats(req,res){
        console.log('decreseSeats: ', req.body);
        try{
            const created = await bigliettiService.decrementaPosti(req.body);
            res.status(201).json({
                succes: true,
                data: created
            });
        }catch(err){
            res.status(400).json({
                success: false, 
                message: err.message
            })
        }
    }

    //RISPOSTA RICHIESTA RICERCA VOLI PER L'UTENTE
    static async voloSearch(req,res){
        console.log('voloSearch:', req.body);
        try{
            const voli = await bigliettiService.cercaVolo(req.body);
            res.status(200).json({
                success:true,
                data:voli
            });
        } catch(err){
            res.status(400).json({
                success:false,
                message:err.message
            });
        }
    }

    //RISPOSTA RICHIESTA LOGIN PER IL CLIENTE
    static async loginClient(req,res){
        try{
            const cliente = await bigliettiService.loginCliente(req.body);

            // Creazione del token JWT
            const token = jwt.sign( 
                //informazioni sul cliente
                { idCliente: cliente.idCliente,
                  nome: cliente.nome, 
                  cognome: cliente.cognome,  
                  email: cliente.email, 
                  role: 'cliente' },
                //chiave segreta per la firma del token  
                process.env.JWT_SECRET,
                //durata di validità
                { expiresIn: '3h' } 
            );

            res.status(200).json({
                success:true,
                token: token, 
                data: cliente
            });
        } catch(err){
            res.status(400).json({
                success:false,
                message:err.message
            });
        }
    }

    //RISPOSTA RICHIESTA REGISTRAZIONE PER IL CLIENTE
    static async registerClient(req,res){
        try{
            console.log("Dati ricevuti in authController: ", req.body);
            const cliente = await bigliettiService.registrazioneCliente(req.body);

            //Creazione del token
            const token = jwt.sign( 
                //informazioni sul cliente
                { idCliente: cliente.idCliente, 
                  nome: cliente.nome, 
                  cognome: cliente.cognome, 
                  email: cliente.email, 
                  role:'cliente' },
                //chiave segreta per la firma del token  
                process.env.JWT_SECRET,
                //durata di validità
                { expiresIn: '3h' } 
            );

            res.status(201).json({
                success:true,
                token: token,
                data: cliente
            });
        } catch(err){
            res.status(400).json({
                success:false,
                message:err.message
            });
        }
    }

    //RISPOSTA RICHIESTA CREAZIONE BIGLIETTO
    static async createTicket(req,res){
        try{
            const biglietto = await bigliettiService.createBiglietto(req.body);
            res.status(201).json({
                success:true,
                data: biglietto
            });
        } catch(err){
            res.status(400).json({
                success:false,
                message:err.message
            });
       }
    }

    //RISPOSTA RICHIESTA MODIFICA BIGLIETTO
    static async ticketModification(req,res){
        try{
            const biglietto = await bigliettiService.modificaTicket(req.body);
             res.status(201).json({
                succes: true,
                data: biglietto
            });
        }catch(err){
             res.status(400).json({
                success: false, 
                message: err.message
            })
        }
    }

    //RISPOSTA RICHIESTA POSTI OCCUPATI
    static async getPosti(req,res){
        try{
            const posti = await bigliettiService.getPostiOccupati(req.body);
            res.status(200).json({
                success:true,
                data: posti
            });
        }catch(err){
            res.status(400).json({
                success:false,
                message:err.message
            });
        }
    }

    //RISPOSTA RICHIESTA RICERCA DEI BIGLIETTI ACQUISTATI DAL CLIENTE REGISTRATO
    static async returnTickets(req,res){
        try{ 
            //in questo modo è più sicuro che vengano cercati i biglietti del cliente il cui token è stato validato
            const biglietti = await bigliettiService.returnBiglietti(req.user.idCliente);

            res.status(200).json({
                success:true,
                data: biglietti
            });
        } catch(err){
            res.status(400).json({
                success:false,
                message:err.message
            });
        }
    }

    //RISPOSTA RICHIESTA RICERCA DI TUTTI I BIGLIETTI ACQUISTATI PER L'AMMINISTRATORE
    static async returnTicketsAdmin(req,res){
        try{
            const biglietti = await bigliettiService.returnBigliettiAdmin();

            res.status(200).json({
                success:true,
                data: biglietti
            });
        } catch(err){
            res.status(400).json({
                success:false,
                message:err.message
            });
        }
    }

    //RISPOSTA RICHIESTA RICERCA DI TUTTI I VOLI PER L'AMMINISTRATORE
    static async returnFlightsForAdmin(req,res){
        try{
            const voli = await bigliettiService.returnForAdmin();

            res.status(200).json({
                success:true,
                data: voli
            });
        } catch(err){
            res.status(400).json({
                success:false,
                message:err.message
            });
        }
    }

    //RISPOSTA RICHIESTA RICERCA BIGLIETTO PER EFFETTUARE IL CHECK-IN
    static async returnForCheckIn(req,res){
        try{
            const biglietto = await bigliettiService.returnForCheckIn(req.body);

            res.status(200).json({
                success:true,
                data: biglietto,
            });
        }
        catch(err){
            res.status(400).json({
                success:false,
                message:err.message
            });
        }
    }

    //RISPOSTA RICHIESTA CREAZIONE SI UN PASSEGGERO
    static async createPassenger(req,res){
        try{
            const passeggero = await bigliettiService.createPasseggero(req.body);
            
            res.status(201).json({
                success:true,
                data: passeggero
            });
        } catch(err){
            res.status(400).json({
                success:false,
                message:err.message
            });
        }
    }
}

module.exports = AuthControllerBiglietti;