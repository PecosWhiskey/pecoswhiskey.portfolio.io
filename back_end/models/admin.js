const db = require('../database/dbAdmin.js');
const bcrypt = require('bcryptjs'); //modulo necessario per il confronto delle password

class Admin {

//Funzione che trova l'amministratore utilizzando la sua email
  static async findByEmail(email) {
     return new Promise((resolve, reject) => {
        db.get('SELECT * FROM admin WHERE email = ?', [email], (err, row) => {
          if (err){
            return reject(err);
          }
          resolve(row);
        });
      }); 
  }

//Funzione che confronta la password inserita con quella salvata nel db
  static async comparePassword(candidatePassword, hash) {
    return bcrypt.compare(candidatePassword, hash);
  }
}

module.exports = Admin;