// src/routes/historialRiegoRoutes.ts
import { Router } from 'express';
import { getAllRiego, crearHistorialRiego } from '../controllers/historialRiegoController';

const router = Router();

// GET: traer todo el historial de riego
router.get('/', async (req, res, next) => {
  try {
    await getAllRiego(req, res);
  } catch (err) {
    next(err);
  }
});

// POST: crear un nuevo registro de historial de riego
router.post('/', async (req, res, next) => {
  try {
    await crearHistorialRiego(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
