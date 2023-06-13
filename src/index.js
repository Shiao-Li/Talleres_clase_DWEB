const app = require('./server.js')
require('dotenv').config()


const connection = require('./database.js')
connection()

app.listen(app.get('port'),()=>{
    console.log(`Server on port ${app.get('port')}`);
})

