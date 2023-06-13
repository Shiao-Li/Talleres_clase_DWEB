const User = require('../models/User')
const passport = require("passport")

//PRESENTAR EL FORMULARIO PARA EL REGISTRO
const renderRegisterForm =(req,res)=>{
    res.render('user/registerForm')
}
// CAPTURAR LOS DATOS DEL FORMULARIO Y GUARDAD EN BDD
const registerNewUser =async(req,res)=>{
    // DESESTRUCTURAR LOS DATOS DEL FORMULARIO
    const{name,email,password,confirmpassword} = req.body
    //VALIDAR SI TODOS LOS CAMPOS ESTAN COMPLETOS
    if (Object.values(req.body).includes("")) return res.send("Lo sentimos, debes llenar todos los campos")
    // VALIDACION DE LAS CONTRASEÑAS 
    if(password != confirmpassword) return res.send("Lo sentimos, los passwords no coinciden")
    // TRAER EL USUARIO EN BASE AL EMAIL
    const userBDD = await User.findOne({email})
    //VERIFICAR SI EXSITE EL USUARIO
    if(userBDD) return res.send("Lo sentimos, el email ya se encuentra registrado")
    // GUARDAR EL REGISTRO EN LA BDD
    const newUser = await new User({name,email,password,confirmpassword})
    // ENCRIPTAR EL PASSWORD
    newUser.password = await newUser.encrypPassword(password)
    newUser.save()
    res.redirect('/user/login')
}
// PRESENTAR EL FORMULARIO PAR AEL LOGIN
const renderLoginForm =(req,res)=>{
    res.render('user/loginForm')
}
// CAPTURAR LOS DATOS DEL FORMULARIO Y HACER LOGIN EN LA BDD

const loginUser = passport.authenticate('local',{
    failureRedirect:'/user/login',
    successRedirect:'/portafolios'
})

// CAPTURAR LOS DATOS DEL FORMULARIO Y HACER EL LOGOUT EN BDD

const logoutUser =(req,res)=>{
    req.logout((err)=>{
        if (err) return res.send("Ocurrio un error") 
        res.redirect('/');
    });
}

module.exports={
    renderRegisterForm,
    registerNewUser,
    renderLoginForm,
    loginUser,
    logoutUser
}