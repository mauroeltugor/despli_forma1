// init.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const config = require('./config.js');

const createDefaultAdminUser = async () => {
    try {
        await mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        const adminExists = await User.findOne({ roles: 'admin' });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('AdminPassword14@', 10);

            const adminUser = new User({
                username: 'admin2@example.com',
                name: 'Admin User',
                password: hashedPassword,
                roles: ['admin'],
            });

            await adminUser.save();
            console.log('Usuario administrador predeterminado creado exitosamente.');
        } else {
            console.log('Ya existe un usuario administrador en la base de datos.');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error al crear el usuario administrador predeterminado:', error);
    }
};

createDefaultAdminUser();
