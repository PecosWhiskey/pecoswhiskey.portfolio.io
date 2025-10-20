require('dotenv').config(); //Carica le variabili d'ambiente dal file '.env' globalmente per tutta l'applicazione
const express = require('express');
const app = express();
const authRoutes = require('./auth/authRoutes/authRoutes.js');
const db = require('./database/dbAdmin');


app.use(express.json());


const cors = require('cors');
app.use(cors());


app.use(cors({
  origin: 'http://localhost:8100', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'] //per esporre l'headers al client nelle risposta
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