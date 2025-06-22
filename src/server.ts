import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

//Rutas
import invernaderoRouter from './router/invernaderoRouter';


const app = express();
app.use(cors({ origin: 'http://localhost:' })); 
app.use(express.json());

// endpoints
app.use('/api/invernadero', invernaderoRouter);

export default app;