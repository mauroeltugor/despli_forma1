const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const { authenticate, checkRole } = require("./src/middlewares/authenticate"); // Asegúrate de tener el middleware de verificación de roles
const crypto = require("crypto");

require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Genera tokens secretos aleatorios
const generateTokenSecret = () => {
    return crypto.randomBytes(64).toString("hex");
};

const ACCESS_TOKEN_SECRET = generateTokenSecret();
const REFRESH_TOKEN_SECRET = generateTokenSecret();

// Guarda los tokens secretos en variables de entorno
process.env.ACCESS_TOKEN_SECRET = ACCESS_TOKEN_SECRET;
process.env.REFRESH_TOKEN_SECRET = REFRESH_TOKEN_SECRET;

async function main() {
    await mongoose.connect(process.env.BD_CONNECTION_STRING);
    console.log("Connected to MongoDB :D");
}
main().catch(console.error);

app.use("/api/signup", require("./src/routes/signup"));
app.use("/api/login", require("./src/routes/login"));
app.use("/api/user", authenticate, require("./src/routes/user"));
app.use("/api/signout", require("./src/routes/signout"));
app.use("/api/todos", authenticate, require("./src/routes/todos"));
app.use("/api/refresh-token", require("./src/routes/refreshToken"));

// Middleware de verificación de roles
const checkAdmin = checkRole('administrador');
const checkCliente = checkRole('cliente');

// Definición de rutas protegidas
const protectedRoutes = express.Router();

// Ruta protegida para administradores
protectedRoutes.get('/admin-route', authenticate, checkAdmin, (req, res) => {
    // Lógica específica para administradores
    res.json({ message: 'Acceso permitido para administradores.' });
});

// Ruta protegida para clientes
protectedRoutes.get('/client-route', authenticate, checkCliente, (req, res) => {
    // Lógica específica para clientes
    res.json({ message: 'Acceso permitido para clientes.' });
});

// Uso de las rutas protegidas
app.use('/api/protected', protectedRoutes);

app.get("/", (req, res) => {
    res.send("hello world");
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
