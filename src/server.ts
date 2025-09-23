import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import admin from 'firebase-admin';
import path from 'path'; // Se importa el módulo 'path'

// --- CONFIGURACIÓN INICIAL ---
dotenv.config();

// --- INICIALIZACIÓN DE FIREBASE (CON RUTA CORREGIDA) ---
try {
  // Se construye la ruta de forma dinámica para que funcione en cualquier entorno
  const serviceAccountPath = path.join(__dirname, '..', 'firebase.json');
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('✅ Firebase Admin SDK inicializado correctamente.');
} catch (error) {
  console.error('❌ Error al inicializar Firebase Admin. Revisa la configuración.', error);
}

// --- CREACIÓN DE LA APP DE EXPRESS ---
const app = express();

// --- MIDDLEWARES ---
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: frontendUrl,
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// --- IMPORTACIÓN DE RUTAS ---
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
import visitaRouter from './router/visitaRouter';
import notificacionesRouter from './router/notificationesRouter';

// --- DEFINICIÓN DE RUTAS DE LA API ---
app.use('/api/auth', authRouter);
app.use('/api/notificaciones', notificacionesRouter);
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

// --- MANEJADOR DE ERRORES GLOBAL ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error global capturado:', err.stack);
    res.status(500).json({
      error: 'Algo salió mal en el servidor.',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    });
});

// --- CREACIÓN DE SERVIDOR HTTP Y SOCKET.IO ---
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: frontendUrl,
    methods: ['GET', 'POST']
  }
});
app.set('io', io);
io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado a Socket.IO:', socket.id);
  socket.on('disconnect', () => {
    console.log('🔌 Cliente desconectado:', socket.id);
  });
});

// --- EXPORTACIONES ---
export { app, server, io };
