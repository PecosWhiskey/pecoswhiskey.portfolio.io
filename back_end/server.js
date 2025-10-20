require('dotenv').config(); //Carica le variabili d'ambiente dal file '.env' globalmente per tutta l'applicazione
const express = require('express');
const app = express();
const authRoutes = require('./auth/authRoutes/authRoutes.js');
const db = require('./database/dbAdmin');


app.use(express.json());


const cors = require('cors');

// Configurazione CORS per sviluppo e production
const allowedOrigins = [
  'http://localhost:8100',  // Sviluppo locale
  'https://pecoswhiskey.github.io'  // Production GitHub Pages
];

app.use(cors({
  origin: function (origin, callback) {
    // Permetti richieste senza origin (es. Postman, app mobile)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'], //per esporre l'headers al client nelle risposta
  credentials: true
}));

app.use('/api/auth', authRoutes);

// app.get('/admin', (req, res, next) => {

//   db.all(`SELECT * FROM admin`,(err, rows) =>{
//     res.json(rows)
//   }
//   ); 
// })

// Intercetta errori del server
// app.use((err, req, res, next) => {
//   console.log("Headers ricevuti: ", req.headers);
//   console.error(err.stack);
//   res.status(500).json({ success: false, message: 'Errore interno del server' });
// });

// Avvio server
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});