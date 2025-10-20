const sqlite3 = require('sqlite3').verbose(); //modulo necessario per creare il database
const path = require('path');

const dbPath = path.join(__dirname, 'dbAdmin.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Errore connessione al database ADMIN:', err.message);
    } else {
      console.log('Connessione al database ADMIN sqlite avvenuta con successo');
      console.log('Database path:', dbPath);
      db.run(`CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )`, (err) => {
        if (err) {
          console.error('Errore creazione tabella admin:', err.message);
        } else {
          console.log('Tabella admin creata o già esistente');
        }
      });
    }
});

module.exports = db; 