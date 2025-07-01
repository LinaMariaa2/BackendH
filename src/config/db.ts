// src/config/db.ts
import { Sequelize } from 'sequelize-typescript';
import * as path from 'path';

// --- DEBUGGING: Imprimir valores de las variables de entorno ---
console.log('DEBUG DB_HOST:', process.env.SQ_HOST);
console.log('DEBUG DB_PORT:', process.env.SQ_PORT);
console.log('DEBUG DB_USER:', process.env.SQ_USER);
console.log('DEBUG DB_PASSWORD (length):', process.env.SQ_PASSWORD?.length);
console.log('DEBUG DB_NAME:', process.env.SQ_DB_NAME);
console.log('DEBUG DB_SSL:', process.env.DB_SSL);
// --- FIN DEBUGGING ---

// Forzar el tipo a 'any' para evitar cualquier error de tipado de Sequelize
const sequelize = new Sequelize({
    dialect: 'postgres',
    // NO PONEMOS 'family: 4' AQUÍ DIRECTAMENTE, lo pasamos a dialectOptions para el driver subyacente.
    // Esto es para que TypeScript no se queje de una propiedad que no está directamente en SequelizeOptions

    host: process.env.SQ_HOST as string,
    port: parseInt(process.env.SQ_PORT || '6543', 10),
    username: process.env.SQ_USER as string,
    password: process.env.SQ_PASSWORD as string,
    database: process.env.SQ_DB_NAME as string,

    models: [path.join(__dirname, '/../models')],

    logging: false,

    dialectOptions: {
        // Configuramos SSL
        ssl: process.env.DB_SSL === 'true' ? {
            require: true,
            rejectUnauthorized: false
        } : undefined,

        // *** PASAMOS 'family: 4' DIRECTAMENTE AL DRIVER PG A TRAVÉS DE dialectOptions ***
        // Al ponerlo aquí, Sequelize lo pasará a la librería 'pg' subyacente,
        // y como 'dialectOptions' es más flexible, debería evitar el error de tipo principal.
        // @ts-ignore // Volvemos a usar ts-ignore por si acaso, aunque aquí debería ser más tolerante
        family: 4 // Forzar el uso de IPv4 para el driver de PostgreSQL
    } as any, // <--- Forzamos el tipo de dialectOptions a 'any' para evitar el error TS2769

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Función para autenticar la conexión y sincronizar los modelos
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
        await sequelize.sync({ force: false });
        console.log('Modelos sincronizados con la base de datos.');
    } catch (error: any) {
        console.error('FATAL ERROR: Error durante la inicialización del servidor y la conexión a la base de datos:', error);
        throw error;
    }
}

export { sequelize, connectDB };