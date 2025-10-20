const authServiceAdmin = require('../authService/authServiceAdmin');
const jwt = require('jsonwebtoken'); //modulo necessario per la creazione del token

class AuthControllerAdmin{

     //LOGIN  
     static async login(req,res){
      try{
        const admin = await authServiceAdmin.loginAdmin(req.body);

        //Creazione del token JWT
        const token = jwt.sign(
          //informazioni sull'utente
          {idAdmin: admin.id, email: admin.email, role: 'admin'},
          //chiave segreta per la firma del token
          process.env.JWT_SECRET,
          //durata di validità
          { expiresIn: '3h' }
        )

        res.status(201).json({
          succes: true,
          token: token,
          data: admin
        });
      } catch(err){
          res.status(400).json({
            success: false,
            message: err.message
          });
      }
    }
}

module.exports = AuthControllerAdmin;