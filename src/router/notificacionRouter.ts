import { Router } from 'express';
import { visitaController } from '../controllers/visitaController';

const router = Router();

// GET /api/notificaciones - Obtiene todas las visitas para ser mostradas como notificaciones
router.get('/', visitaController.obtenerTodas);

export default router;
