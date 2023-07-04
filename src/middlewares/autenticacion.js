// Importacion de jwt
import jwt from 'jsonwebtoken'
// Importacion del modelo
import Veterinario from '../models/Veterinario.js'

// Definir la funcion para validar el JWT
const verificarAutenticacion = async (req,res,next)=>{
    // Validar del jwt
    // req.body
    // req.params
    // req.params
    // re.hedears.authorization ()
    if(!req.headers.authorization) return res.status(404).json({msg:"Lo sentimos, debes proprocionar un token"})    
        // Obtenener el jwt
        const {authorization} = req.headers
        // 
        try {
            // Obtener solo el token 
            const {id} = jwt.verify(authorization.split(' ')[1],process.env.JWT_SECRET)
            // Obtener el usario en base al ID
            req.veterinarioBDD = await Veterinario.findById(id).lean().select("-password")
            // Next
            next()
        } catch (error) {
            const e = new Error("Formato del token no válido")
            return res.status(404).json({msg:e.message})
        }
}

// Exportar la funcion
export default verificarAutenticacion
