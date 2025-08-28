// src/router/historialIluminacionRouter.ts
import { Router } from 'express';
import { getAllIluminacion, crearHistorialIluminacion } from '../controllers/historialIluminacionController';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    await getAllIluminacion(req, res);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    await crearHistorialIluminacion(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
