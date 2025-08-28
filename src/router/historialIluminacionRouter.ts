import { Router } from 'express';
import { 
  getAllIluminacion,
  getIluminacionById,
  createIluminacion
} from '../controllers/historialIluminacionController';

const router = Router();

// Ruta: /historial/iluminacion
router.get('/', getAllIluminacion);
router.get('/:id', getIluminacionById);
router.post('/', createIluminacion);

export default router;
