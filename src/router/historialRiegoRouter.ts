// src/routes/historialRiegoRouter.ts

import { Router } from 'express';
import { getAllRiego, getRiegoByInvernadero } from '../controllers/historialRiegoController';

const router = Router();

// Ruta: /historial/riego
router.get('/', getAllRiego);



export default router;
