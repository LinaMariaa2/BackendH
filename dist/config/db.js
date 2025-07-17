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
const sequelize_typescript_1 = require("sequelize-typescript");
const path = __importStar(require("path"));
// --- DEBUG: Mostrar variables de entorno importantes ---
console.log('DEBUG DB_HOST:', process.env.DB_HOST);
console.log('DEBUG DB_PORT:', process.env.DB_PORT);
console.log('DEBUG DB_USER:', process.env.DB_USER);
console.log('DEBUG DB_PASSWORD (length):', process.env.DB_PASSWORD?.length);
console.log('DEBUG DB_NAME:', process.env.DB_NAME);
// --- Sequelize ---
const sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST, // ejemplo: db.yasjwniajgvwkrxyyfrm.supabase.co
    port: parseInt(process.env.DB_PORT || '6543', 10), // puerto del pooler de transacciones
    username: process.env.DB_USER, // usualmente 'postgres'
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    models: [path.join(__dirname, '/../models')],
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Supabase no usa CA pública
        },
        family: 4, // 👈 Fuerza IPv4 (necesario para evitar errores en algunas redes)
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
exports.sequelize = sequelize;
// Función para conectar y sincronizar modelos
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');
        await sequelize.sync({ force: false }); // cambiar a 'true' solo si quieres reiniciar los datos
        console.log('✅ Modelos sincronizados con la base de datos.');
    }
    catch (error) {
        console.error('❌ FATAL ERROR: No se pudo conectar a la base de datos:', error);
        throw error;
    }
}
//# sourceMappingURL=db.js.map