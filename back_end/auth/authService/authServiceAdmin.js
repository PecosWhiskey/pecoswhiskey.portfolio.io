const admin = require('../../models/admin.js');

class AuthServiceAdmin {
    
    //Funzione per il login dell'amministratore
    static async loginAdmin({email, password}){
      try{
            const user = await admin.findByEmail(email);  
           
            if(!user){
                throw new Error("Credenziali non valide!");
            }

            const pass = await admin.comparePassword(password, user.password);

            if(!pass ){
                throw new Error("Credenziali non valide!");
            }

            return user;

        }catch (err) {
            console.log("ERRORE AUTH SERVICE ADMIN: ", err.message);
            throw err;
        }
    }
}

module.exports = AuthServiceAdmin;