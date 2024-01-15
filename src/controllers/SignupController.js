const User = require('../models/user');
const { jsonResponse } = require('./jsonResponse');
const sendConfirmationEmail = require('../routes/correos');

exports.createUser = async (req, res) => {
    const { username, name, password, role } = req.body; // Asegúrate de que 'role' esté presente en req.body

    // Verificar que username sea un correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
        return res.status(400).json(jsonResponse(400, { error: 'El nombre de usuario debe ser un correo válido.' }));
    }

    // Verificar que el password tenga al menos 8 caracteres, un número y una mayúscula
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json(jsonResponse(400, { error: 'La contraseña debe tener al menos 8 caracteres, un número y una mayúscula.' }));
    }

    try {
        const exists = await User.findOne({ username });

        if (exists) {
            return res.status(400).json(jsonResponse(400, { error: 'El nombre de usuario ya existe.' }));
        }

        const newUser = new User({ username, name, password, roles: [role || 'cliente'] });
        await newUser.save();
        sendConfirmationEmail(username);

        res.status(200).json(jsonResponse(200, { message: 'Usuario creado.' }));
    } catch (error) {
        console.error(error);
        res.status(500).json(jsonResponse(500, { error: 'Error al crear un usuario.' }));
    }
};
