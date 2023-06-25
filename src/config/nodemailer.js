// importar modulo
const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
// tiene configraciones del servidor SMT
const transporter = nodemailer.createTransport({
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP
    }
})

// Definir la estructura del correo electronico
// send mail with defined transport object
module.exports.sendMailToUser = async(userMail,token)=>{
    // el cuerpo del mail
    let info = await transporter.sendMail({
    // DE
    from: 'admin@esfot.com',
    // PARA
    to: userMail,
    // AUNTO
    subject: "Verifica tu cuenta de correo electrónico",
    // CUERPO DEL MAIL
    html: `<a href="http://localhost:3000/user/confirmar/${token}">Clic para confirmar tu cuenta</a>`,
    });
    // VERIFICAR EN CONSOLA
    console.log("Message sent: %s", info.messageId);
}