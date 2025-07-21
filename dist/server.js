"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
// Es buena práctica cargar las variables de entorno al principio de la aplicación,
// pero si ya lo haces en index.ts, puedes omitir esta línea aquí.
// dotenv.config();
console.log('DEBUG: Iniciando configuración de Express...');
const app = (0, express_1.default)();
// Middlewares Esenciales
app.use(express_1.default.json()); // Permite a Express parsear JSON en las solicitudes
console.log('DEBUG: Middleware express.json() aplicado.');
// Configuración de CORS
// ¡IMPORTANTE! Usa process.env.FRONTEND_URL para la URL de tu frontend
// Esto permite que la URL sea configurable para diferentes entornos (desarrollo, producción)
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Usa la variable de entorno o un fallback
    credentials: true // Permite el envío de cookies de autenticación
}));
console.log('DEBUG: Middleware CORS aplicado con origen:', process.env.FRONTEND_URL || 'http://localhost:3000');
app.use((0, morgan_1.default)('dev')); // Middleware para logging de solicitudes HTTP en modo de desarrollo
console.log('DEBUG: Middleware Morgan para logging aplicado.');
// Importa tus routers
const invernaderoRouter_1 = __importDefault(require("./router/invernaderoRouter"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const gestionarCultivoRouter_1 = __importDefault(require("./router/gestionarCultivoRouter"));
const bitacoraRouter_1 = __importDefault(require("./router/bitacoraRouter"));
const imagenRouter_1 = __importDefault(require("./router/imagenRouter"));
const zonaRouter_1 = __importDefault(require("./router/zonaRouter"));
const authRouter_1 = __importDefault(require("./router/authRouter"));
const perfilRouter_1 = __importDefault(require("./router/perfilRouter"));
const personaRouter_1 = __importDefault(require("./router/personaRouter"));
const programacionIluminacionRouter_1 = __importDefault(require("./router/programacionIluminacionRouter"));
const programacionRiegoRouter_1 = __importDefault(require("./router/programacionRiegoRouter"));
// Definición de Rutas (Endpoints)
console.log('DEBUG: Definiendo rutas...');
app.use('/api/invernadero', invernaderoRouter_1.default);
app.use('/api/zona', zonaRouter_1.default);
app.use('/api/cultivos', gestionarCultivoRouter_1.default);
app.use('/api/bitacora', bitacoraRouter_1.default);
app.use('/api/imagen', imagenRouter_1.default);
app.use('/api/perfil', perfilRouter_1.default);
app.use('/api/persona', personaRouter_1.default);
app.use('/api/programacionIluminacion', programacionIluminacionRouter_1.default);
app.use('/api/programacionRiego', programacionRiegoRouter_1.default);
// Ruta de autenticación para login, registro, etc.
app.use('/api/auth', authRouter_1.default);
console.log('DEBUG: Ruta /api/auth configurada con authRouter.');
// Ruta para gestión de usuarios (CRUD de usuarios y subida de fotos)
app.use('/api/users', userRouter_1.default); // Conectamos el router de usuarios
console.log('DEBUG: Ruta /api/users configurada con userRouter.');
// Manejador de errores global
const globalErrorHandler = (err, req, res, next) => {
    console.error('DEBUG: Error global capturado:', err.stack);
    // En producción, evita enviar detalles sensibles del error
    res.status(500).json({
        error: 'Algo salió mal en el servidor.',
        details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    });
};
app.use(globalErrorHandler);
console.log('DEBUG: Manejador de errores global configurado.');
exports.default = app; // Exporta la instancia de Express, el inicio del servidor se hará en index.ts
//# sourceMappingURL=server.js.map