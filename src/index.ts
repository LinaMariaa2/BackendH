import dotenv from 'dotenv';
dotenv.config();

import { server } from './server';
import { sequelize } from './config/db';

const port = process.env.PORT || 4000;

async function startServer() {
    try {
        await sequelize.authenticate();
        //await sequelize.sync({ alter: true });
        await sequelize.sync({ alter: true, match: /^(?!tbl_gestion_cultivos).*$/ }); // vamos a dejar que todo se sincronice menos la tbl de cultivos
        

        server.listen(port, () => {
            console.log(`Servidor backend corriendo en http://localhost:${port}`);
        });
    } catch (error) {
        console.error('ERROR FATAL: Error durante la inicialización del servidor:', error);
        process.exit(1);
    }
}

startServer();