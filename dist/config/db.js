"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
exports.connectDB = connectDB;
// src/config/db.ts
const sequelize_typescript_1 = require("sequelize-typescript");
const path = __importStar(require("path"));
// --- Validaciones de Variables de Entorno al inicio ---
// Es crucial que estas variables existan antes de intentar usar Sequelize.
// Si no existen, salimos del proceso para evitar errores posteriores.
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
const sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'postgres',
    // Aseguramos el tipo string explícitamente para evitar advertencias de TypeScript.
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10), // Convertimos a número de forma segura
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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
exports.sequelize = sequelize;
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
    }
    catch (error) {
        console.error('❌ FATAL ERROR: No se pudo conectar a la base de datos:', error);
        // Volver a lanzar el error para que `index.ts` pueda manejar la salida del proceso.
        throw error;
    }
}
//# sourceMappingURL=db.js.map