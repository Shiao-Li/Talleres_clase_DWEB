const{Router} = require('express')

const router = Router()

// EXPORTAR MIS CONTROLADORES
const { renderAllPortafolios,
        renderPortafolio,
        renderPortafolioForm,
        createNewPortafolio,
        renderEditPortafolioForm,
        updatePortafolio,
        deletePortafolio
    } = require('../controllers/portafolio.controller.js')

// CREAR RUTAS Y LLAMAR A MI MEOTODO DEL CONTROLADORES
router.get('/portafolio/add', renderPortafolioForm)
router.post('/portafolio/add', createNewPortafolio)
router.get('/portafolios', renderAllPortafolios)
router.get('/portafolio/:id', renderPortafolio)
router.get('/portafolio/edit/:id', renderEditPortafolioForm)
router.put('/portafolio/edit/:id', updatePortafolio)
router.delete('/portafolio/delete/:id', deletePortafolio)

// EXPORTAR MIS ROUTES
module.exports = router