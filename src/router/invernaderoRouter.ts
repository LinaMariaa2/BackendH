import { Router } from 'express';
import { invernaderoController } from '../controllers/invernaderoController';
import {validateInvernaderoId, validateInvernaderoNombreUnico, validateInvernaderoBody, validateInvernaderoUpdate} from '../middlewares/invernaderoValidator';
import { handleInputErrors } from '../middlewares/validation';
import { zonaController } from '../controllers/zonaController';

const router = Router();


router.get('/', invernaderoController.getAll);
router.get('/activos', invernaderoController.getAllActivos);

router.get(
  '/:id/zonas', 
  validateInvernaderoId, 
  handleInputErrors, 
  zonaController.getZonasPorInvernadero);

router.get(
  '/:id',
  validateInvernaderoId,
  handleInputErrors,
  invernaderoController.getId
);

router.post(
  '/',
  validateInvernaderoBody,
  validateInvernaderoNombreUnico,
  handleInputErrors,
  invernaderoController.crearInvernadero
);

router.put(
  '/:id',
  validateInvernaderoId,
  validateInvernaderoUpdate,
  handleInputErrors, 
  invernaderoController.actualizarInvernadero
);

router.patch(
  '/inactivar/:id',
  validateInvernaderoId,
  handleInputErrors,
  invernaderoController.inactivarInvernadero
);

router.patch(
  '/activar/:id',
  validateInvernaderoId,
  handleInputErrors,
  invernaderoController.activarInvernadero
);

router.patch(
  '/mantenimiento/:id',
  validateInvernaderoId,
  handleInputErrors,
  invernaderoController.mantenimientoInvernadero
);
router.patch(
  '/:id/estado',
  validateInvernaderoId,
  handleInputErrors,
  invernaderoController.cambiarEstadoGenerico
);

router.delete(
  '/:id',
  validateInvernaderoId,
  handleInputErrors,
  invernaderoController.eliminarInvernadero
);

export default router;
