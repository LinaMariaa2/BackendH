// src/index.ts
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables at the very beginning!

console.log('Variables de entorno cargadas:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Cargado' : 'NO CARGADO');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Cargado' : 'NO CARGADO');
console.log('SQ_HOST:', process.env.SQ_HOST);

import server from './server'; // Import your Express application from server.ts
import { sequelize, connectDB} from './config/db'; // Import 'sequelize' from your database config file

const port = process.env.PORT || 3000; // Use the port from .env or 3000 by default

async function startServer() {
    try {
        // 1. Authenticate (connect) to the database
        await sequelize.authenticate();
        console.log('Database connection successfully established.');

        // 2. Synchronize models with the database
        // `alter: true` will apply non-destructive changes to all tables managed by Sequelize,
        // including Invernadero, Zona, and Persona.
        await sequelize.sync({ alter: true });
        console.log('Database and models synchronized.');

        // 3. Start the Express server
        server.listen(port, () => {
            console.log(`Server listening on port http://localhost:${port}`);
        });
    } catch (error) {
        console.error('FATAL ERROR: Error during server initialization:', error);
        process.exit(1); // Exit the process with an error code
    }
}

// Call the function to start the server
startServer();