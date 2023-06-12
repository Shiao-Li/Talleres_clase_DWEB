// PLANTILLA DE CRUD

// hacer 
const Portfolio = require('../models/portfolio')

const renderAllPortafolios = async(req,res)=>{
    // apartir del modelo usar el metodo find y luego el metodo lean
    const portfolios = await Portfolio.find().lean()
    // invocar la vista y pasar la variable portafolios
    res.render("portafolio/allPortfolios",{portfolios})
}

const renderPortafolio = (req,res)=>{
    res.send('Mostrar el detalle de un portafolio')
}

// PRESENTAR EL FORMULARIO
const renderPortafolioForm = (req,res)=>{
    res.render('portafolio/newFormPortafolio')
}
// CAPTURAR LOS DATOS DEL FORMULARIO PARA ALMACENAR EN LA BDD
const createNewPortafolio =async (req,res)=>{
    // desestructurar
    const {title, category,description} = req.body
    // crear nueva instancia
    const newPortfolio = new Portfolio({title,category,description})
    // ejecutar el metodo save
    await newPortfolio.save()
    res.redirect('/portafolios')
    // res.send("Portafolio almacenado en la BDD")
}
const renderEditPortafolioForm =async(req,res)=>{
    // a partir del medelo llamar al metodo findById
    const portfolio = await Portfolio.findById(req.params.id).lean()
    // con la variable portafolio pintar en la vista del formulario
    res.render('portafolio/editPortfolio',{portfolio})
}
const updatePortafolio = async(req,res)=>{
    // capturamos los datos del formulario
    const {title,category,description}= req.body
    // a partir del modelo llamar al metodo findByIdAndUpdate
    // pasando a la funcion el id del portafolio y los datos a modificar
    await Portfolio.findByIdAndUpdate(req.params.id,{title,category,description})
    res.redirect('/portafolios')
}
const deletePortafolio = async(req,res)=>{
// a partir del modelo usar el metodo findByIdAndDelete
    await Portfolio.findByIdAndDelete(req.params.id)
    // hacer el redirect
    res.redirect('/portafolios')
}

// EXPORT NOMBRADO
module.exports ={
    renderAllPortafolios,
    renderPortafolio,
    renderPortafolioForm,
    createNewPortafolio,
    renderEditPortafolioForm,
    updatePortafolio,
    deletePortafolio
}