const jwt = require('jsonwebtoken');

//Middleware che verifica la presenza del token nella richiesta e la sua validità
function verifyToken(req, res, next){
    //Recupera il campo 'authorization' dalla richiesta (dove è presente il token)
    const authHeader = req.headers['authorization']; 
    //Se il campo è presente ne viene ricavato il token
    const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    //Se il token è assente l'utente non ha l'autorizzazione per effettuare la richiesta
    return res.status(401).json({ message: 'Token mancante' });
  }

  //Se presente, verifica se il token è valido, utilizzando la chiave con cui è stato firmato
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      //Se la verifica restituisce errore allora non si può proseguire oltre nella richiesta
      return res.status(403).json({ message: 'Token non valido' });
    }
    //Aggiunge un nuovo campo alla richiesta "req.user" che contiene il payload del token
    req.user = decoded;

    next(); 
  });
}

module.exports = verifyToken;