import { Sequelize } from 'sequelize-typescript';
import * as path from 'path';

if (!process.env.DB_HOST) {
    console.error('❌ ERROR CRÍTICO: La variable de entorno DB_HOST no está definida.');
    process.exit(1);
}
if (!process.env.DB_PORT) {
    console.error('❌ ERROR CRÍTICO: La variable de entorno DB_PORT no está definida.');
    process.exit(1);
}
if (!process.env.DB_USER) {
    console.error('❌ ERROR CRÍTICO: La variable de entorno DB_USER no está definida.');
    process.exit(1);
}
if (!process.env.DB_PASSWORD) {
    console.error('❌ ERROR CRÍTICO: La variable de entorno DB_PASSWORD no está definida.');
    process.exit(1);
}
if (!process.env.DB_NAME) {
    console.error('❌ ERROR CRÍTICO: La variable de entorno DB_NAME no está definida.');
    process.exit(1);
}

// --- DEBUG: Mostrar variables de entorno importantes (solo en desarrollo) ---
if (process.env.NODE_ENV === 'development') {
    console.log('DEBUG DB_HOST:', process.env.DB_HOST);
    console.log('DEBUG DB_PORT:', process.env.DB_PORT);
    console.log('DEBUG DB_USER:', process.env.DB_USER);
    console.log('DEBUG DB_PASSWORD (length):', process.env.DB_PASSWORD?.length ? 'Definida' : 'No definida');
    console.log('DEBUG DB_NAME:', process.env.DB_NAME);
}

// --- Inicialización de Sequelize ---
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string, 10),
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,

    // Carga los modelos de forma automática desde la carpeta 'models'
    models: [path.join(__dirname, '/../models')],
    
    logging: false,

    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
        family: 4,
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

// --- Función para conectar y sincronizar modelos ---
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');

        // Sincroniza solo si hay cambios en los modelos, no elimines la base de datos
        await sequelize.sync({ alter: true });
        console.log('✅ Modelos sincronizados con la base de datos.');
    } catch (error: any) {
        console.error('❌ FATAL ERROR: No se pudo conectar a la base de datos:', error);
        throw error;
    }
}

export default sequelize;
export { sequelize, connectDB };
