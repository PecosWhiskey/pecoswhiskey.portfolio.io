// Script di inizializzazione database per Render
const db = require('./database/dbAdmin');
const dbBiglietti = require('./database/dbBiglietti');
const inserisciAdmin = require('./database/inserisciAdmin');

console.log('🚀 Inizializzazione database...');

// Crea le tabelle se non esistono
db.serialize(() => {
  // Tabella admin
  db.run(`CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error('❌ Errore creazione tabella admin:', err);
    } else {
      console.log('✅ Tabella admin pronta');
      
      // Inserisci un admin di default solo se non esiste
      db.get('SELECT * FROM admin WHERE email = ?', ['admin@vaygo.com'], async (err, row) => {
        if (!row) {
          try {
            await inserisciAdmin.inserisciAdmin('admin@vaygo.com', 'admin123');
            console.log('✅ Admin di default creato: admin@vaygo.com / admin123');
          } catch (error) {
            console.error('❌ Errore creazione admin:', error);
          }
        } else {
          console.log('ℹ️ Admin già esistente');
        }
      });
    }
  });
});

// Inizializza anche il database biglietti
dbBiglietti.serialize(() => {
  // Aggiungi qui le CREATE TABLE per le altre tabelle se necessario
  console.log('✅ Database biglietti pronto');
});

console.log('🎉 Inizializzazione completata');
