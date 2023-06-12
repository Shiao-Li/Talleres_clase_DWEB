const mongoose = require('mongoose')

const MONGODB_URI = 'mongodb://0.0.0.0:27017/portafolio'

const {DBUSER,DBPASSWORD,DBNAME} = process.env

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
