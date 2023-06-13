//INVOCAR LA FUNCION ROUTER
const { Router } = require('express')
// INVOCAR LAS FUNCIONES DEL CONTROLADOR 
const { renderRegisterForm, registerNewUser, renderLoginForm, loginUser, logoutUser } = require('../controllers/user.controller')

// INICIALIZAR LA FUNCION EN LA VARIABLE ROUTER
const router = Router()

// DEFINIR LAS RUTAS 
router.get('/user/register', renderRegisterForm)
router.post('/user/register', registerNewUser)


router.get('/user/login', renderLoginForm)
router.post('/user/login', loginUser)


router.post('/user/logout', logoutUser)

// EXPORTACION POR DEFAULT 
module.exports = router