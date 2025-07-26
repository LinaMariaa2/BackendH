import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Eliminar la segunda declaración de 'app'
const app = express(); // Esta es la única declaración necesaria
app.use(express.json());

//console.log('DEBUG: Middleware CORS aplicado con origen:', process.env.FRONTEND_URL || 'http://localhost:3000');
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

//console.log('DEBUG: Middleware Morgan para logging aplicado.');
app.use(morgan('dev'));

// Importación de Routers
import invernaderoRouter from './router/invernaderoRouter';
import zonaRouter from './router/zonaRouter';
import gestionarCultivoRouter from './router/gestionarCultivoRouter';
import bitacoraRouter from './router/bitacoraRouter';
import programacionIluminacionRouter from './router/programacionIluminacionRouter';
import programacionRiegoRouter from './router/programacionRiegoRouter';
import historialRiegoRouter from './router/historialRiegoRouter';
import historialIluminacionRouter from './router/historialIluminacionRouter';

// Registro y Autenticacion
import userRouter from './router/userRouter';
import imagenRouter from './router/imagenRouter';
import authRouter from './router/authRouter';
import perfilRouter from './router/perfilRouter';
import personaRouter from './router/personaRouter';

// Montaje de Routers
app.use('/api/invernadero', invernaderoRouter);
app.use('/api/zona', zonaRouter);
app.use('/api/cultivos', gestionarCultivoRouter);
app.use('/api/bitacora', bitacoraRouter);
app.use('/api/programacionIluminacion', programacionIluminacionRouter);
app.use('/api/programacionRiego', programacionRiegoRouter);
app.use('/api/historialIluminacion', historialIluminacionRouter);
app.use('/api/historialRiego', historialRiegoRouter);

//Autenticacion Regsitro user
app.use('/api/imagen', imagenRouter);
app.use('/api/perfil', perfilRouter);
app.use('/api/persona', personaRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

// Manejador de errores global
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    //console.error('DEBUG: Error global capturado:', err.stack);

    res.status(500).json({
        error: 'Algo salió mal en el servidor.',
        details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    });
};
app.use(globalErrorHandler);

export default app;
