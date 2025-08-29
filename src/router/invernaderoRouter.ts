import { Router } from 'express';
import { InvernaderoController } from '../controllers/invernaderoController';
import { validateInvernaderoId, validateInvernaderoNombreUnico, validateInvernaderoBody, validateInvernaderoUpdate } from '../middlewares/invernaderoValidator';
import { handleInputErrors } from '../middlewares/validation';
import { zonaController } from '../controllers/zonaController';

const router = Router();

// ✅ Rutas activas que sí existen en tu InvernaderoController
router.get('/', InvernaderoController.getAllInvernaderos);
router.get('/por-operario/:idOperario', InvernaderoController.getInvernaderosByOperarioId);

router.post(
  '/',
  validateInvernaderoBody,
  validateInvernaderoNombreUnico,
  handleInputErrors,
  InvernaderoController.createInvernadero
);

router.put(
  '/:id',
  validateInvernaderoId,
  validateInvernaderoUpdate,
  handleInputErrors,
  InvernaderoController.updateInvernadero
);

router.delete(
  '/:id',
  validateInvernaderoId,
  handleInputErrors,
  InvernaderoController.deleteInvernadero
);

// ✅ Rutas nuevas y descomentadas para gestionar el estado del invernadero
router.patch(
  '/inactivar/:id',
  validateInvernaderoId,
  handleInputErrors,
  InvernaderoController.inactivarInvernadero
);

router.patch(
  '/activar/:id',
  validateInvernaderoId,
  handleInputErrors,
  InvernaderoController.activarInvernadero
);

router.patch(
  '/mantenimiento/:id',
  validateInvernaderoId,
  handleInputErrors,
  InvernaderoController.mantenimientoInvernadero
);

export default router;
