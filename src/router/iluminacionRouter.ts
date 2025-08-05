import { Router } from 'express';
import { iluminacionController } from '../controllers/iluminacionController';

const router = Router();

// Rutas para el conteo de iluminación activa
router.get('/invernaderos-activos', iluminacionController.getInvernaderosActivos);

router.get('/zonas-activas', iluminacionController.getZonasActivas);

export default router;