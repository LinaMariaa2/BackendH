

import express from 'express';
import morgan from 'morgan'; // For HTTP request logs
import cors from 'cors';

// Import existing routers for Invernadero and Zona
import invernaderoRouter from './router/invernaderoRouter';
import zonaRouter from './router/zonaRouter';

// IMPORTANT!: Import the NEW routers for Authentication and Person Management
import authRouter from './router/authRouter'; 
import userRouter from './router/userRouter'; 

const app = express();

// Essential Middlewares
app.use(express.json()); // Enable body-parser for JSON
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Configure CORS for your frontend

// Logging Middleware (optional, but useful for debugging in development)
app.use(morgan('dev'));

// Define Routes (Endpoints)

// Your existing routes for Invernadero and Zona - THESE DO NOT CHANGE
app.use('/api/invernaderos', invernaderoRouter);
app.use('/api/zonas', zonaRouter);


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
