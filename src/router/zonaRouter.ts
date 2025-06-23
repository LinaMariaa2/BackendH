import { Router } from 'express';
import { zonaController } from '../controllers/zonaController';
import { validateZonaId, validateZonaNombreUnico, validateZonaBody, validateInvernaderoExistente} from '../middlewares/zonaValidator';
import { handleInputErrors } from '../middlewares/validation';

const router = Router();
router.get('/', zonaController.getAll);

router.get('/todos', zonaController.getAllActivos);

router.get(
  '/:id',
  validateZonaId,
  handleInputErrors,
  zonaController.getById
);

// Crear nueva zona (solo si invernadero está activo y tiene < 5 zonas)
router.post(
  '/',
  validateZonaBody,
  validateZonaNombreUnico,
  validateInvernaderoExistente,
  handleInputErrors,
  zonaController.crearZona
);

router.put(
  '/:id',
  validateZonaId,
  validateZonaBody,
  validateZonaNombreUnico,
  handleInputErrors,
  zonaController.actualizarZona
);

router.patch(
  '/inactivar/:id',
  validateZonaId,
  handleInputErrors,
  zonaController.inactivarZona
);

router.patch(
  '/activar/:id',
  validateZonaId,
  handleInputErrors,
  zonaController.activarZona
);

router.patch(
  '/mantenimiento/:id',
  validateZonaId,
  handleInputErrors,
  zonaController.mantenimientoZona
);

router.delete( 
    '/:id',
    validateZonaId,
    handleInputErrors,
    zonaController.eliminarZona
);

export default router;
