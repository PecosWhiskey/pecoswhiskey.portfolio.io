function onlyAdmin(req, res, next) {

  //Controlla il valore della proprietà 'role' a cui accede dal campo nuovo inserito dal middleware 'verifyToken'
  if (req.user.role !== 'admin') {
    //Se non è quello previsto non si può proseguire oltre nella richiesta
    return res.status(403).json({ message: 'Accesso riservato agli admin' });
  }

  next();
}

module.exports = onlyAdmin;
