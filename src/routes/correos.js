const nodemailer = require("nodemailer");
const password1="multiservicios1234"
const password="rwam fpkv zevq bnmn"
const correo="parkinlocation753@gmail.com"
// Configura el transporte de Nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // O el servicio de correo que uses
  port: 587,
  auth: {
    user: correo,
    pass: password,
  },
});

// Función para enviar el correo de confirmación de registro
async function sendConfirmationEmail(email) {
  try {
    await transporter.sendMail({
      from: "parkinlocation753@gmail.com",
      to: email,
      subject: "Confirmación de Registro",
      text: "¡Gracias por registrarte!",
      html:  `
      <div>
        <p>Bienvenido</p>
        <p>Haz ingresado a ParkingLocation</p>
        <p>Gracias por ingresar :) </p>
      </div>
    `,
    });
    console.log("Correo de confirmación enviado."+email);
  } catch (error) {
    console.error("Error al enviar el correo de confirmación:", error);
  }
}

module.exports = sendConfirmationEmail;
