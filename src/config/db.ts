// src/config/db.ts
import { Sequelize } from 'sequelize-typescript';
import * as path from 'path';

if (!process.env.DB_HOST) {
    console.error('❌ ERROR CRÍTICO: La variable de entorno DB_HOST no está definida.');
    process.exit(1); // Sale de la aplicación
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
// Evitamos mostrar contraseñas completas en logs.
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
    // Aseguramos el tipo string explícitamente para evitar advertencias de TypeScript.
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string, 10), // Convertimos a número de forma segura
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,

    // Configuración para cargar modelos automáticamente desde la carpeta 'models'
    // 'path.join(__dirname, '/../models')' es correcto y robusto.
    models: [path.join(__dirname, '/../models')],
    logging: false, // Mantener en false para producción, true para depuración de SQL

    dialectOptions: {
        ssl: {
            require: true, // Forzar el uso de SSL
            // rejectUnauthorized: false es común para Supabase ya que no usa CAs estándar
            // para sus certificados, pero ten en cuenta la implicación de seguridad.
            // Para producción, se recomienda configurar un CA si es posible.
            rejectUnauthorized: false,
        },
        family: 4, // Fuerza el uso de IPv4, lo cual es bueno si has tenido problemas de conexión
    },

    pool: {
        max: 5, // Número máximo de conexiones en el pool
        min: 0, // Número mínimo de conexiones en el pool
        acquire: 30000, // Tiempo máximo, en milisegundos, para que una conexión se adquiera antes de lanzar un error
        idle: 10000, // Tiempo máximo, en milisegundos, que una conexión puede estar inactiva en el pool antes de ser liberada
    },
    
});


// --- Función para conectar y sincronizar modelos ---
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');

        // ¡IMPORTANTE! 'force: true' ELIMINA Y RECREA TODAS LAS TABLAS.
        // Úsalo SOLO en desarrollo si quieres resetear tu base de datos.
        // En producción, usa 'alter: true' (para aplicar cambios aditivos) o 'false' (para no hacer cambios).
        // Aquí lo dejaremos en 'false' como buena práctica para producción.
        await sequelize.sync({ force: false });
        console.log('✅ Modelos sincronizados con la base de datos.');
    } catch (error: any) {
        console.error('❌ FATAL ERROR: No se pudo conectar a la base de datos:', error);
        // Volver a lanzar el error para que `index.ts` pueda manejar la salida del proceso.
        throw error;
    }
}
export default sequelize;
export { sequelize, connectDB };