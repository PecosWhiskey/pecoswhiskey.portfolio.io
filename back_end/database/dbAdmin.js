const sqlite3 = require('sqlite3').verbose(); //modulo necessario per creare il database

const db = new sqlite3.Database("database\\dbAdmin.sqlite", (err) => {
    if (err) {
      console.error('Errore connessione al database ADMIN:', err.message);
    } else {
      console.log('Connessione al database ADMIN sqlite avvenuta con successo');
      db.run(`CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT UNIQUE NOT NULL
      )`);
    }
});

module.exports = db; 