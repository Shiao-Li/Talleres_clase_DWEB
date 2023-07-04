// Importo el modelo veterinario
import Veterinario from "../models/Veterinario.js"
// import sendMailToUser from "../config/nodemailer.js"
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"
// Se importa JWT
import generarJWT from "../helpers/crearJWT.js"
// 
import mongoose from "mongoose";

// Todas las funciones

// METODO PARA LOGIN
const login = async(req,res)=>{
    // Capturar datos del requests
    const {email,password} = req.body
    // Validacion de campos vacios
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Obtener el usuario en base al email
    const veterinarioBDD = await Veterinario.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
    // Validacion de la cuneta del email
    if(veterinarioBDD?.confirmEmail===false) return res.status(403).json({msg:"Lo sentimos, debe verificar su cuenta"})
    // Validar su existe el usuario
    if(!veterinarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    // Creacion del token
    const token = generarJWT(veterinarioBDD._id)
    // Validar si el password del reques es el mismo de la bdd
    const verificarPassword = await veterinarioBDD.matchPassword(password)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    // Desesetructurar la info del usario
    const {nombre,apellido,direccion,telefono,_id} = veterinarioBDD
    // Presentar datos
    res.status(200).json({
        token,
        nombre,
        apellido,
        direccion,
        telefono,
        _id,
        email:veterinarioBDD.email
    })
}

// METODO MOSTAR PERFIL
const perfil =(req,res)=>{
    delete req.veterinarioBDD.token
    delete req.veterinarioBDD.confirmEmail
    delete req.veterinarioBDD.createdAt
    delete req.veterinarioBDD.updatedAt
    delete req.veterinarioBDD.__v
    res.status(200).json(req.veterinarioBDD)
}

// METODO PARA EL REGISTRO
const registro = async (req,res)=>{
    // Capturar los datos del boy de la peticion
    const {email,password} = req.body
    // Validacion de los campos vacios 
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Verificar la existencia del mail
    const verificarEmailBDD = await Veterinario.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    // Crear la instancia del modelo
    const nuevoVeterinario = new Veterinario(req.body)
    // Encriptar el assword del usuario
    nuevoVeterinario.password = await nuevoVeterinario.encrypPassword(password)
    // Crear el token del usuario
    const token = nuevoVeterinario.crearToken()
    // Invocar la funcion para el envio del correo
    await sendMailToUser(email,token)
    // Guardar en la BDD
    await nuevoVeterinario.save()
    // Enviar la respuesta
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}

// METODO PARA LA CONFIRMACION DEL USUARIO
const confirmEmail = async (req,res)=>{
    // Validar el token del correo
    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    // Verificar si en base al token existe ese usuario
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
    // Validar si el token ya fue seteado a null
    if(!veterinarioBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
    // setear a null el token
    veterinarioBDD.token = null
    // Cambiar a true la confirmacion de la cuenta
    veterinarioBDD.confirmEmail=true
    // Guarda cambios en la BDD
    await veterinarioBDD.save()
    // Presentar el mensaje al usuario
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 
}

const listarVeterinarios = (req,res)=>{
    res.status(200).json({res:'lista de veterinarios registrados'})
}

// METODO DETALLE VETERINARIO
const detalleVeterinario = async(req,res)=>{
    // Obtener datos del request params
    const {id} = req.params
    // Validar el ID
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    // Obtener el usario en base al id
    const veterinarioBDD = await Veterinario.findById(id).select("-password")
    // Validar si existe el usario
    if(!veterinarioBDD) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
    // Mostrar datos del usuario
    res.status(200).json({msg:veterinarioBDD})
}

// Metodo para actualizar el perfil
const actualizarPerfil = async (req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const veterinarioBDD = await Veterinario.findById(id)
    if(!veterinarioBDD) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
    if (veterinarioBDD.email !=  req.body.email)
    {
        const veterinarioBDDMail = await Veterinario.findOne({email:req.body.email})
        if (veterinarioBDDMail)
        {
            return res.status(404).json({msg:`Lo sentimos, el existe ya se encuentra registrado`})  
        }
    }
		veterinarioBDD.nombre = req.body.nombre || veterinarioBDD?.nombre
    veterinarioBDD.apellido = req.body.apellido  || veterinarioBDD?.apellido
    veterinarioBDD.direccion = req.body.direccion ||  veterinarioBDD?.direccion
    veterinarioBDD.telefono = req.body.telefono || veterinarioBDD?.telefono
    veterinarioBDD.email = req.body.email || veterinarioBDD?.email
    await veterinarioBDD.save()
    res.status(200).json({msg:"Perfil actualizado correctamente"})
}

const actualizarPassword = (req,res)=>{
    res.status(200).json({res:'actualizar password de un veterinario registrado'})
}

// METODO RECUPERAR CONTRASEÑA
const recuperarPassword = async(req,res)=>{
    // Capturar el email del request
    const {email} = req.body
    // Validacion de los caompos vacios
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Obtener el usario en base al email
    const veterinarioBDD = await Veterinario.findOne({email})
    if(!veterinarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    // Crear token
    const token = veterinarioBDD.crearToken()
    // Establecer el token en el usario obtenido previamente
    veterinarioBDD.token=token
    //Enviar el email de recumeporacion
    await sendMailToRecoveryPassword(email,token)
    await veterinarioBDD.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu cuenta"})
}


const comprobarTokenPasword = async (req,res)=>{
    // Validar el token
    if(!(req.params.token)) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    // Obtener el usuario en base al token
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
    // Validacion de la existencia del usuario
    if(veterinarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    // Guardar en la BDD
    await veterinarioBDD.save()
    // Presentar los menssajes al usaurio
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}


const nuevoPassword = async (req,res)=>{
    // Obtener el password nuevo y la confirmacion del password del request
    const{password,confirmpassword} = req.body
    // Validacion de campos vacios
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Validacion de coincidencia del password
    if(password != confirmpassword) return res.status(404).json({msg:"Lo sentimos, los passwords no coinciden"})
    // Obtener los datos del usuario en base al token
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
    // Validar la existencia del usario
    if(veterinarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    // Setear el token nuevamente al null
    veterinarioBDD.token = null
    // 
    veterinarioBDD.password = await veterinarioBDD.encrypPassword(password)
    // Guardar en BDD
    await veterinarioBDD.save()
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 
}

// Exportacio nombrada
export {
    login,
    perfil,
    registro,
    confirmEmail,
    listarVeterinarios,
    detalleVeterinario,
    actualizarPerfil,
    actualizarPassword,
	recuperarPassword,
    comprobarTokenPasword,
	nuevoPassword
}