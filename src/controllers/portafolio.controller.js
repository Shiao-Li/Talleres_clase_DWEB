// INSTANCIA EL MODELO
const Portfolio = require('../models/Portfolio')
// const { uploadImage } = require('../config/cloudinary')
const fs = require('fs-extra')
const { uploadImage, deleteImage } = require('../config/cloudinary')

// LISTAR PORTAFOLIOS
const renderAllPortafolios = async (req, res) => {
    const portfolios = await Portfolio.find({ user: req.user._id }).lean()
    res.render("portafolio/allPortfolios", { portfolios })
}


const renderPortafolio = (req, res) => {
    res.send('Mostrar el detalle de un portafolio')
}


// PRESENTAR EL FORMULARIO
const renderPortafolioForm = (req, res) => {
    res.render('portafolio/newFormPortafolio')
}

// CAPTURAR LOS DATOS DEL FORMULARIO PARA ALMACENAR EN LA BDD
const createNewPortafolio = async (req, res) => {
    // DESESTRUCTURAR
    const { title, category, description } = req.body
    //CREAR UNA NUEVA INSTANCIA
    const newPortfolio = new Portfolio({ title, category, description })
    // a la instancia newPortfolio le agrego ahora el usuario
    // req.user._id viene de la sesion
    newPortfolio.user = req.user._id

    // VALIDACION DE LA IMAGEN
    if (!(req.files?.image)) return res.send("Se requiere una imagen")
    const imageUpload = await uploadImage(req.files.image.tempFilePath)
    newPortfolio.image = {
        public_id: imageUpload.public_id,
        secure_url: imageUpload.secure_url
    }
    // ELIMINAR EK ARCHIVO TEMP DEL DIRECTORIO UPLOADS
    await fs.unlink(req.files.image.tempFilePath)
    // EJECUTAR EL METODO SAVE()
    await newPortfolio.save()
    res.redirect('/portafolios')
}

const renderEditPortafolioForm = async (req, res) => {
    // a partir del modelo llamara al metodo findById
    const portfolio = await Portfolio.findById(req.params.id).lean()
    // con la variable portfolio pontar en la vista del formulario
    res.render('portafolio/editPortfolio', { portfolio })
}

// FUNCION ACTUALIZAR
const updatePortafolio = async (req, res) => {
    const portfolio = await Portfolio.findById(req.params.id).lean()
    if (portfolio._id != req.params.id) return res.redirect('/portafolios')

    if (req.files?.image) {
        // vamos a realizar la actulizacion de la imagen
        // validar que venga una imagen en el formulario
        if (!(req.files?.image)) return res.send("Se requiere una imagen")
        // eliminar la imagen en cloudinary
        await deleteImage(portfolio.image.public_id)
        // cargar la nueva imagen
        const imageUpload = await uploadImage(req.files.image.tempFilePath)
        // counstruir la data para actulizar en BDD
        const data = {

            title: req.body.title || portfolio.name, // se mantengan lo que esta en los imputs
            category: req.body.category || portfolio.category,
            description: req.body.description || portfolio.description,
            image: {
                public_id: imageUpload.public_id,
                secure_url: imageUpload.secure_url
            }
        }
        // eliminar la imagen temporal
        await fs.unlink(req.files.image.tempFilePath)
        // Actualizar en BDD findByIdAndUpdate
        await Portfolio.findByIdAndUpdate(req.params.id, data)
    }
    else {
        const { title, category, description } = req.body
        await Portfolio.findByIdAndUpdate(req.params.id, { title, category, description })
    }
    res.redirect('/portafolios')
}

// FUNCION BORRAR PORTAFOLIO
const deletePortafolio = async (req, res) => {
    const portafolio = await Portfolio.findByIdAndDelete(req.params.id)
    await deleteImage(portafolio.image.public_id)
    res.redirect('/portafolios')
}


module.exports = {
    renderAllPortafolios,
    renderPortafolio,
    renderPortafolioForm,
    createNewPortafolio,
    renderEditPortafolioForm,
    updatePortafolio,
    deletePortafolio
}