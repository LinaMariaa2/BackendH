"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables at the very beginning!
console.log('Variables de entorno cargadas:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Cargado' : 'NO CARGADO');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Cargado' : 'NO CARGADO');
console.log('SQ_HOST:', process.env.SQ_HOST);
const server_1 = __importDefault(require("./server")); // Import your Express application from server.ts
const db_1 = require("./config/db"); // Import 'sequelize' from your database config file
const port = process.env.PORT || 4000; // Use the port from .env or 3000 by default
async function startServer() {
    try {
        // 1. Authenticate (connect) to the database
        await db_1.sequelize.authenticate();
        console.log('Database connection successfully established.');
        // 2. Synchronize models with the database
        // `alter: true` will apply non-destructive changes to all tables managed by Sequelize,
        // including Invernadero, Zona, and Persona.
        await db_1.sequelize.sync({ alter: true });
        console.log('Database and models synchronized.');
        // 3. Start the Express server
        server_1.default.listen(port, () => {
            console.log(`Server listening on port http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error('FATAL ERROR: Error during server initialization:', error);
        process.exit(1); // Exit the process with an error code
    }
}
// Call the function to start the server
startServer();
//# sourceMappingURL=index.js.map