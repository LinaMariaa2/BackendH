// src/router/historialRouter.ts
import { Router } from 'express';
// Importa las funciones controladoras directamente por su nombre
import { getAllIluminacion } from '../controllers/historialIluminacionController'; 
import { getAllRiego } from '../controllers/historialRiegoController'; 

const router = Router();


router.get('/riego', getAllRiego); 


router.get('/iluminacion', getAllIluminacion); 

export default router;