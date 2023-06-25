const mongoose = require('mongoose')

// Conexion a base de datos local
const MONGODB_URI = 'mongodb://0.0.0.0:27017/portafolio'
// Conexion a base de datos en la nube
// const {DBUSER,DBPASSWORD,DBNAME} = process.env

connection = async()=>{
    try {
         await mongoose.connect(MONGODB_URI,{
            useUnifiedTopology:true,
            useNewUrlParser:true
        })
        console.log("Database is connected")
    } catch (error) {
        console.log(error);
    }
}

module.exports = connection