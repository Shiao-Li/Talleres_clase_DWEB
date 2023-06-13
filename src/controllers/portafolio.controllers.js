
// INSTANCIA EL MODELO
const Portfolio = require('../models/Portfolio')

const renderAllPortafolios = async(req,res)=>{
    const portfolios = await Portfolio.find().lean()
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
    // DESESTRUCTURAR
    const {title, category,description} = req.body
    //CREAR UNA NUEVA INSTANCIA
    const newPortfolio = new Portfolio({title,category,description})
    // EJECUTAR EL METODO SAVE()
    await newPortfolio.save()
    res.redirect('/portafolios')
}

const renderEditPortafolioForm =async(req,res)=>{
    // a partir del modelo llamara al metodo findById
    const portfolio = await Portfolio.findById(req.params.id).lean()
    // con la variable portfolio pontar en la vista del formulario
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
    await Portfolio.findByIdAndDelete(req.params.id)
    res.redirect('/portafolios')
}


module.exports ={
    renderAllPortafolios,
    renderPortafolio,
    renderPortafolioForm,
    createNewPortafolio,
    renderEditPortafolioForm,
    updatePortafolio,
    deletePortafolio
}