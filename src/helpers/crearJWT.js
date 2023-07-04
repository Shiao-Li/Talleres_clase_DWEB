// Importacion de JWT
import jwt from "jsonwebtoken";
// Definicr la funcion para generar el token
const generarJWT = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1d"})
}

// Exportar por default la funcion
export default  generarJWT