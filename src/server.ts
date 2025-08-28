import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

console.log('DEBUG: Iniciando configuración de Express...');

const app = express();

console.log('DEBUG: Middleware express.json() aplicado.');
app.use(express.json());

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
console.log('DEBUG: Middleware CORS aplicado con origen:', frontendUrl);
app.use(cors({
  origin: frontendUrl,
  credentials: true,
}));

console.log('DEBUG: Middleware Morgan para logging aplicado.');
app.use(morgan('dev'));

// -----------------------------
// Importación de Routers
// -----------------------------
import invernaderoRouter from './router/invernaderoRouter';
import zonaRouter from './router/zonaRouter';
import gestionarCultivoRouter from './router/gestionarCultivoRouter';
import bitacoraRouter from './router/bitacoraRouter';
import programacionIluminacionRouter from './router/programacionIluminacionRouter';
import programacionRiegoRouter from './router/programacionRiegoRouter';
import historialRiegoRouter from './router/historialRiegoRouter';
import historialIluminacionRouter from './router/historialIluminacionRouter';
import userRouter from './router/userRouter';
import imagenRouter from './router/imagenRouter';
import authRouter from './router/authRouter';
import perfilRouter from './router/perfilRouter';
import personaRouter from './router/personaRouter';
import iluminacionRouter from './router/iluminacionRouter';

// -----------------------------
// Definición de Rutas
// -----------------------------
console.log('DEBUG: Definiendo rutas...');

app.use('/api/auth', authRouter);
console.log('DEBUG: Ruta /api/auth configurada con authRouter.');

app.use('/api/invernadero', invernaderoRouter);
app.use('/api/zona', zonaRouter);
app.use('/api/cultivos', gestionarCultivoRouter);
app.use('/api/bitacora', bitacoraRouter);

// 🚨 Nueva ruta para programación de iluminación
app.use('/api/programacionIluminacion', programacionIluminacionRouter);
console.log('DEBUG: Ruta /api/programacionIluminacion configurada con programacionIluminacionRouter.');

app.use('/api/programacionRiego', programacionRiegoRouter);
app.use('/api/historialIluminacion', historialIluminacionRouter);
app.use('/api/historialRiego', historialRiegoRouter);
app.use('/api/imagen', imagenRouter);
app.use('/api/perfil', perfilRouter);
app.use('/api/persona', personaRouter);
app.use('/api/iluminacion', iluminacionRouter);

app.use('/api/users', userRouter);
console.log('DEBUG: Ruta /api/users configurada con userRouter.');

// -----------------------------
// Middleware Global de Errores
// -----------------------------
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('DEBUG: Error global capturado:', err.stack);
  res.status(500).json({
    error: 'Algo salió mal en el servidor.',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
};

app.use(globalErrorHandler);
console.log('DEBUG: Manejador de errores global configurado.');

export default app;
