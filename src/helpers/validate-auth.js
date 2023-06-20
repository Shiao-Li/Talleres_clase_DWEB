// exportamos una funcion isAuthenticated que portege rutas que deberian estar logiadas
// req, rest.next

module.exports.isAuthenticated = (req,res,next)=>{
    // validacion del  isAuthenticated
    if(req.isAuthenticated()){
        // continua con las demas rutas
        return next()
    }
    // caso contrario retorna al login
    res.redirect('/user/login')
}