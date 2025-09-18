import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';


dotenv.config();
const app = express();
app.use(express.json());

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

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
import lecturaSensorRouter from './router/lecturaSensorRouter';
import { errorHandler } from './middlewares/errorHandler';
import visitaRouter from './router/visitaRouter';


// Definición de Rutas

app.use('/api/auth', authRouter);

app.use('/api/invernadero', invernaderoRouter);
app.use('/api/zona', zonaRouter);
app.use('/api/cultivos', gestionarCultivoRouter);
app.use('/api/bitacora', bitacoraRouter);

app.use('/api/visita', visitaRouter);
app.use('/api/programacionIluminacion', programacionIluminacionRouter);

app.use('/api/programacionRiego', programacionRiegoRouter);
app.use('/api/historialIluminacion', historialIluminacionRouter);
app.use('/api/historialRiego', historialRiegoRouter);
app.use('/api/imagen', imagenRouter);
app.use('/api/perfil', perfilRouter);
app.use('/api/persona', personaRouter);
app.use('/api/iluminacion', iluminacionRouter); 
app.use('/api/lecturas', lecturaSensorRouter);

app.use('/api/users', userRouter);

//errore justidicados
app.use(errorHandler);
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

// Crear servidor HTTP y Socket.IO
const server = createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: frontendUrl,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

export { app, server, io }; // <-- Exportamos los tres

