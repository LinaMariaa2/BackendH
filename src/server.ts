import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

//Rutas
import invernaderoRouter from './router/invernaderoRouter';
import zonaRouter from './router/zonaRouter'



const app = express();
app.use(cors({ origin: 'http://localhost', credentials: true }));
app.use(express.json());



// endpoints
app.use('/api/invernadero', invernaderoRouter);
app.use('/api/zona', zonaRouter);



export default app;