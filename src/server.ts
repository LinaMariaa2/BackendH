import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv'; // Asegúrate de que dotenv esté importado si no lo está globalmente

// Es buena práctica cargar las variables de entorno al principio de la aplicación,
// pero si ya lo haces en index.ts, puedes omitir esta línea aquí.
// dotenv.config();

console.log('DEBUG: Iniciando configuración de Express...');

const app = express();

// Middlewares Esenciales
app.use(express.json()); // Permite a Express parsear JSON en las solicitudes
console.log('DEBUG: Middleware express.json() aplicado.');

// Configuración de CORS
// ¡IMPORTANTE! Usa process.env.FRONTEND_URL para la URL de tu frontend
// Esto permite que la URL sea configurable para diferentes entornos (desarrollo, producción)
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Usa la variable de entorno o un fallback
    credentials: true // Permite el envío de cookies de autenticación
}));
console.log('DEBUG: Middleware CORS aplicado con origen:', process.env.FRONTEND_URL || 'http://localhost:3000');


app.use(morgan('dev')); // Middleware para logging de solicitudes HTTP en modo de desarrollo
console.log('DEBUG: Middleware Morgan para logging aplicado.');

// Importa tus routers
import invernaderoRouter from './router/invernaderoRouter';
import userRouter from './router/userRouter';
import gestionarCultivoRouter from './router/gestionarCultivoRouter';
import bitacoraRouter from './router/bitacoraRouter';
import imagenRouter from './router/imagenRouter';
import zonaRouter from './router/zonaRouter';
import authRouter from './router/authRouter';
import perfilRouter from './router/perfilRouter';

// Definición de Rutas (Endpoints)
console.log('DEBUG: Definiendo rutas...');

app.use('/api/invernadero', invernaderoRouter);
app.use('/api/zona', zonaRouter);
app.use('/api/cultivos', gestionarCultivoRouter);
app.use('/api/bitacora', bitacoraRouter);
app.use('/api/imagen', imagenRouter);
app.use('/api/perfil', perfilRouter);

// Ruta de autenticación para login, registro, etc.
app.use('/api/auth', authRouter);
console.log('DEBUG: Ruta /api/auth configurada con authRouter.');

// Ruta para gestión de usuarios (CRUD de usuarios y subida de fotos)
app.use('/api/users', userRouter); // Conectamos el router de usuarios
console.log('DEBUG: Ruta /api/users configurada con userRouter.');

// Manejador de errores global
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('DEBUG: Error global capturado:', err.stack);
    // En producción, evita enviar detalles sensibles del error
    res.status(500).json({
        error: 'Algo salió mal en el servidor.',
        details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    });
};
app.use(globalErrorHandler);
console.log('DEBUG: Manejador de errores global configurado.');

export default app; // Exporta la instancia de Express, el inicio del servidor se hará en index.ts
