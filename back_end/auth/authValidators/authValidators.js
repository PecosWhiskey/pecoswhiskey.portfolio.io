const { body, validationResult } = require('express-validator');

const loginValidator = [
    body('email').notEmpty().withMessage('Email obbligatoria'),
    body('password').notEmpty().withMessage('Password obbligatoria')
];

const registerValidatorClient = [
  body('nome').notEmpty().withMessage('Nome obbligatorio'),
  body('cognome').notEmpty().withMessage('Cognome obbligatorio'),
  body('dataNascita').notEmpty().withMessage('Data di nascita obbligatoria'),
  body('documentoID').notEmpty().withMessage('Documento obbligatorio'),
  body('nazionalita').notEmpty().withMessage('Nazionalità obbligatoria'),
  body('stato').notEmpty().withMessage('Stato obbligatorio'),
  body('citta').notEmpty().withMessage('Città obbligatoria'),
  body('CAP').notEmpty().withMessage('CAP obbligatorio'),
  body('email').notEmpty().withMessage('Email obbligatoria'),
  body('password').notEmpty().withMessage('Password obbligatoria')
]

const idTicketValidator = [
  body('idPasseggero').notEmpty().withMessage('Codice fiscale del passeggero obbligatorio per la ricerca'),
  body('idBiglietto').notEmpty().withMessage('Id del biglietto obbligatorio per la ricerca'),
]

const datiVoloValidator = [
  body('partenza').notEmpty().withMessage('città di partenza obbligatorio').isLength({max: 3}).withMessage("Il codice dell'aeroporto può essere di lunghezza massima 3"),
  body('destinazione').notEmpty().withMessage('città di destinazione obbligatoria').isLength({max: 3}).withMessage("Il codice dell'aeroporto può essere di lunghezza massima 3"),
  body('oraPartenza').notEmpty().withMessage('orario di partenza obbligatorio'),
  body('oraArrivo').notEmpty().withMessage('orario di arrivo obbligatorio'),
  body('prezzo').notEmpty().withMessage('prezzo obbligatorio'),
  body('postiDisponibili').notEmpty().withMessage("i numeri di posti sull'aereo devono essere specificati").isInt({ max: 132 }).withMessage("Il numero di posti sull'aereo deve essere massimo di 132")
]

const idVoloValidator = [
  body('idVolo').notEmpty().withMessage('id del volo obbligatorio').isLength({min: 4, max: 6}).withMessage("L'id del volo può avere una lunghezza tra i 4 e i 6 caratteri alfanumerici"),
]

const creationTicketsValidator = [
    body('idVolo').notEmpty().withMessage('id del volo obbligatorio').isLength({min: 4, max: 6}).withMessage("L'id del volo può avere una lunghezza tra i 4 e i 6 caratteri alfanumerici"),
    body('idPasseggero').notEmpty().withMessage('id del passeggero obbligatorio'),
    body('dataPartenza').notEmpty().withMessage('data di partenza obbligatoria'),
    body('prezzoFinale').notEmpty().withMessage('prezzo finale obbligatorio'),
]

const createPassengerValidator = [
  body('idPasseggero').notEmpty().withMessage('Codice fiscale del passeggero obbligatorio'),
  body('nome').notEmpty().withMessage('Nome obbligatorio'),
  body('cognome').notEmpty().withMessage('Cognome obbligatorio'),
  body('dataNascita').notEmpty().withMessage('Data di nascita obbligatoria'),
  body('documentoID').notEmpty().withMessage("Documento obbligatorio"),
]

const idClienteValidator = [
  body('idCliente').notEmpty().withMessage('Codice fiscale del cliente obbligatorio'),
]

//Middleware che verifica che i dati siano validi
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
};
  
module.exports = {loginValidator, registerValidatorClient, datiVoloValidator, idVoloValidator, 
    creationTicketsValidator, createPassengerValidator, idClienteValidator, idTicketValidator, validate};