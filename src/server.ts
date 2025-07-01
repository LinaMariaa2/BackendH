import express from 'express';
import morgan from 'morgan';
import cors from 'cors';


//Rutas
import invernaderoRouter from './router/invernaderoRouter';
import zonaRouter from './router/zonaRouter'
import personaRouter from './router/personaRouter';
import gestionarCultivoRouter from './router/gestionarCultivoRouter'
import ZonaCultivoActualRouter from './router/zonaCultivoActualRouter';
import bitacoraRouter from './router/bitacoraRouter';
import imagenRouter from './router/imagenRouter';


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


export default app;