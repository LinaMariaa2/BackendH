import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();
const app = express();
app.use(express.json());

const allowedOrigins = [
  // URL del frontend desplegado que nos proporcionaste:
  'https://frontend-proyecto-desplegado.onrender.com', 
  // URL del backend desplegado (a veces es necesaria para solicitudes internas):
  'https://backendhortitech.onrender.com', 
  // Desarrollo local:
  'http://localhost:3000', 
  // La variable de entorno, si está definida (Render usa esto para el entorno de build)
  process.env.FRONTEND_URL,
].filter(Boolean) as string[]; // Filtra valores falsy (como undefined) y asegura el tipo string[]

app.use(cors({
  origin: allowedOrigins, // Usamos la lista de orígenes permitidos
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
import visitaRouter from './router/visitaRouter';
import notificacionRouter from './router/notificacionRouter';

// -----------------------------
// Definición de Rutas
// -----------------------------
app.use('/api/auth', authRouter);
app.use('/api/notificaciones', notificacionRouter);
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

// -----------------------------
// Middleware de Errores
// -----------------------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('DEBUG: Error global capturado:', err.stack);
    res.status(500).json({
      error: 'Algo salió mal en el servidor.',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    });
});

console.log('DEBUG: Manejador de errores global configurado.');

// -----------------------------
// Crear servidor HTTP y Socket.IO
// -----------------------------
const server = createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins, // ⭐ USAMOS EL MISMO ARRAY
    methods: ['GET', 'POST']
  }
});

// ⭐ ESTA ES LA LÍNEA QUE FALTABA
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Recibir el rol desde el frontend
  const { role } = socket.handshake.query;

  if (role === 'admin') socket.join('admin');
  else if (role === 'operario') socket.join('operario');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

export { app, server, io };
