// src/index.ts
import dotenv from 'dotenv';
dotenv.config(); // ¡Cargar las variables de entorno al principio de todo!

console.log('Variables de entorno cargadas:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Cargado' : 'NO CARGADO');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Cargado' : 'NO CARGADO');
console.log('DB_HOST:', process.env.DB_HOST); // Asegurarse de que el nombre de la variable sea correcto

// Importa tu aplicación Express desde server.ts
import server from './server';
// Importa la instancia de Sequelize desde tu archivo de configuración de base de datos
import { sequelize } from './config/db'; // Importa 'sequelize' directamente

const port = process.env.PORT || 4000; 

async function startServer() {
    try {
        // 1. Autenticar (conectar) a la base de datos
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida exitosamente.');

        // 2. Sincronizar los modelos con la base de datos
        // `alter: true` aplicará cambios no destructivos a las tablas (añadir columnas, etc.).
        // Si estás en desarrollo y necesitas reiniciar la base de datos, puedes usar `{ force: true }`
        // ¡PERO CUIDADO! `force: true` BORRA y RECREA TODAS LAS TABLAS. Úsalo solo en desarrollo si estás seguro.
        await sequelize.sync({ alter: true });
        console.log('Base de datos y modelos sincronizados.');

        // 3. Iniciar el servidor Express
        server.listen(port, () => {
            console.log(`Servidor backend corriendo en http://localhost:${port}`);
        });
    } catch (error) {
        console.error('ERROR FATAL: Error durante la inicialización del servidor:', error);
        process.exit(1); // Salir del proceso con un código de error
    }
}

// Llama a la función para iniciar el servidor
startServer();