// src/index.ts
import dotenv from 'dotenv';
dotenv.config(); 

/*
console.log('Variables de entorno cargadas:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Cargado' : 'NO CARGADO');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Cargado' : 'NO CARGADO');
console.log('DB_HOST:', process.env.DB_HOST);
*/

import server from './server';

import { sequelize } from './config/db'; 

const port = process.env.PORT || 4000; 

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida exitosamente.');

          await sequelize.sync({ alter: true });
        console.log('Base de datos y modelos sincronizados.');

        server.listen(port, () => {
            console.log(`Servidor backend corriendo en http://localhost:${port}`);
        });
    } catch (error) {
        console.error('ERROR FATAL: Error durante la inicialización del servidor:', error);
        process.exit(1);
    }
}

startServer();