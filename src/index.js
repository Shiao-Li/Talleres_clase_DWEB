const app = require('./server.js')
const connection = require('./database.js')

require('dotenv').config()

app.listen(app.get('port'),()=>{
    console.log(`Servidor en el puerto ${app.get('port')}`);
})

connection()