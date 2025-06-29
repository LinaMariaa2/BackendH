import { Router } from 'express';
import { zonaCultivoActualController } from '../controllers/zonaCultivoActualController';
import { validateZonaId } from '../middlewares/zonaValidator';
import { handleInputErrors } from '../middlewares/validation';

const router = Router();

// Ruta para obtener estado en tiempo real de una zona
router.get(
  '/:id_zona/estado-real',
  validateZonaId,
  handleInputErrors,
  zonaCultivoActualController.EstadoTiempoReal
);

export default router;
