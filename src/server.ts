import express from 'express';
import morgan from 'morgan';
import cors from 'cors';


//Rutas
import invernaderoRouter from './router/invernaderoRouter';
import zonaRouter from './router/zonaRouter'
import personaRouter from './router/personaRouter';


const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


// endpoints
app.use('/api/invernadero', invernaderoRouter);
app.use('/api/zona', zonaRouter);
app.use('/api/persona', personaRouter);



export default app;