const express = require('express');
const router = express.Router();
const authControllerAdmin = require('../authController/authControllerAdmin');
const authControllerBiglietti = require('../authController/authControllerBiglietti');
const verifyToken = require('../../middlewares/verifyToken'); //middleware per verificare il token JWT
const onlyAdmin = require('../../middlewares/onlyAdmin'); //middleware per verifica il ruolo dell'utente che effettua la richiesta
const { loginValidator, registerValidatorClient, datiVoloValidator, idVoloValidator, 
    creationTicketsValidator, createPassengerValidator, idClienteValidator, idTicketValidator, validate } = require('../authValidators/authValidators');

//Login Admin
router.post('/login-admin', loginValidator, validate, authControllerAdmin.login);

//Creazione di un nuovo volo
router.post('/creazione-volo', idVoloValidator, datiVoloValidator, validate, verifyToken, onlyAdmin, authControllerBiglietti.voloCreation);

//Modifica di un volo
router.post('/modifica-volo', idVoloValidator, datiVoloValidator, validate, verifyToken, onlyAdmin, authControllerBiglietti.voloModification);

//Ricerca di tutti i biglietti acquistati
router.get('/prenotazioni-ricevute', verifyToken, onlyAdmin, authControllerBiglietti.returnTicketsAdmin);

//Ricerca dei voli disponibili
router.get('/voli-disponibili', verifyToken, onlyAdmin, authControllerBiglietti.returnFlightsForAdmin);

//Decremento posti disponibili
router.post('/decremento-posti', idVoloValidator, authControllerBiglietti.decreseSeats);

//Ricerca voli effettuata dall'utente
router.post('/ricerca-volo', authControllerBiglietti.voloSearch);

//Login del cliente
router.post('/login-cliente', loginValidator, validate, authControllerBiglietti.loginClient);

//Registrazione del cliente
router.post('/registrazione-cliente', idClienteValidator, registerValidatorClient, validate, authControllerBiglietti.registerClient);

//Creazione del biglietto
router.post('/creazione-biglietto', creationTicketsValidator, validate, authControllerBiglietti.createTicket);

//Ricerca dei posti già occupati sull'aereo
router.post('/posti-occupati', idVoloValidator, validate, authControllerBiglietti.getPosti);

//Ricerca del biglietto per effettuare il check-in
router.post('/cerca-biglietto', idTicketValidator, validate, authControllerBiglietti.returnForCheckIn);

//Modifica del biglietto dopo il check-in
router.post('/modifica-biglietto', authControllerBiglietti.ticketModification);

//Ricerca biglietti acquistati dal cliente
router.post('/ricerca-biglietti', idClienteValidator, validate, verifyToken, authControllerBiglietti.returnTickets);

//Creazione passeggero
router.post('/inserimento-passeggero', createPassengerValidator, validate, authControllerBiglietti.createPassenger);

module.exports = router;