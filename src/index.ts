import dotenv from 'dotenv';
dotenv.config();
import { server } from './server';
import { sequelize } from './config/db';
import './config/firebaseConfig';

const port = process.env.PORT || 4000;
async function startServer() {
    try {
        console.log('DEBUG: Intentando autenticar con la base de datos...');
        await sequelize.authenticate();
        console.log('DEBUG: Autenticación exitosa ✅');

        console.log('DEBUG: Sincronizando modelos...');
        await sequelize.sync({ alter: true });
        console.log('DEBUG: Modelos sincronizados ✅');

        server.listen(port, () => {
            console.log(`🚀 Servidor backend corriendo en http://localhost:${port}`);
        });
    } catch (error) {
        console.error('❌ ERROR FATAL: Error durante la inicialización del servidor:', error);
        process.exit(1);
    }
}


startServer();