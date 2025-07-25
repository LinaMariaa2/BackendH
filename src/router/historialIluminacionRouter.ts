// src/router/historialRouter.ts
import { Router } from 'express';
// Importa las funciones controladoras directamente por su nombre
import { getAllIluminacion } from '../controllers/historialIluminacionController'; 


const router = Router();


router.get('/iluminacion', getAllIluminacion); 

export default router;