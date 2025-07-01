import express from 'express';
import morgan from 'morgan'; // For HTTP request logs
import cors from 'cors';

// Import existing routers for Invernadero and Zona
import invernaderoRouter from './router/invernaderoRouter';
import personaRouter from './router/userRouter';
import gestionarCultivoRouter from './router/gestionarCultivoRouter'
import ZonaCultivoActualRouter from './router/zonaCultivoActualRouter';
import bitacoraRouter from './router/bitacoraRouter';
import imagenRouter from './router/imagenRouter';
import zonaRouter from './router/zonaRouter';

// IMPORTANT!: Import the NEW routers for Authentication and Person Management
import authRouter from './router/authRouter'; 
import userRouter from './router/userRouter'; 

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Puerto del frontend generalmente en next 3000

// endpoints
app.use('/api/invernadero', invernaderoRouter);
app.use('/api/zona', zonaRouter);
app.use('/api/persona', personaRouter);
app.use('/api/gestionarCultivos',gestionarCultivoRouter);
app.use('/api/zonaCultivoActual', ZonaCultivoActualRouter);
app.use('/api/bitacora', bitacoraRouter);
app.use('/api/imagen', imagenRouter);

// Essential Middlewares
app.use(express.json()); // Enable body-parser for JSON
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Configure CORS for your frontend

// Logging Middleware (optional, but useful for debugging in development)
app.use(morgan('dev'));

// Define Routes (Endpoints)

app.use('/api/auth', authRouter); // For registration, login, email verification, admin creation
app.use('/api/users', userRouter); // For user management (admins only)

// Global error handler (Express middleware to catch unhandled errors)
import { Request, Response, NextFunction } from 'express';
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong on the server.',
        details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    });
});

// Export the Express 'app' instance so it can be imported and used in index.ts
export default app;
