const User = require('../models/User')
const passport = require("passport")
const { sendMailToUser } = require("../config/nodemailer")

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
    // llamo al metodo para confirmar por correo
    const token = newUser.crearToken()
    sendMailToUser(email,token)
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

// confirmar el token
const confirmEmail = async(req,res)=>{
    if(!(req.params.token)) return res.send("Lo sentimos, no se puede validar la cuenta")
    // cargar el usuario en base al token receptado
    const userBDD = await User.findOne({token:req.params.token})
    // setear el token a null
    userBDD.token = null
    // cambiar el confirmEmail a True
    userBDD.confirmEmail=true
    // Guardar en la BDD
    await userBDD.save()
    // Mensaje de respuesta
    res.send('Token confirmado, ya puedes iniciar sesión');
}

module.exports={
    renderRegisterForm,
    registerNewUser,
    renderLoginForm,
    loginUser,
    logoutUser,
    confirmEmail
}