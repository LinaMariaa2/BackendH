import { Router } from 'express';
import { InvernaderoController } from '../controllers/invernaderoController';
import { validateInvernaderoId, validateInvernaderoNombreUnico, validateInvernaderoBody, validateInvernaderoUpdate } from '../middlewares/invernaderoValidator';
import { handleInputErrors } from '../middlewares/validation';
import { zonaController } from '../controllers/zonaController';

const router = Router();

// ⚠️ Rutas comentadas porque las funciones no existen en tu InvernaderoController
// router.get('/', InvernaderoController.getAll);
// router.get('/activos', InvernaderoController.getAllActivos);
// router.get('/datos-activos', InvernaderoController.getDatosActivos);

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

// ⚠️ Rutas comentadas porque las funciones no existen en tu InvernaderoController
// router.get(
//   '/:id',
//   validateInvernaderoId,
//   handleInputErrors,
//   InvernaderoController.getId
// );

// router.patch(
//   '/inactivar/:id',
//   validateInvernaderoId,
//   handleInputErrors,
//   InvernaderoController.inactivarInvernadero
// );

// router.patch(
//   '/activar/:id',
//   validateInvernaderoId,
//   handleInputErrors,
//   InvernaderoController.activarInvernadero
// );

// router.patch(
//   '/mantenimiento/:id',
//   validateInvernaderoId,
//   handleInputErrors,
//   InvernaderoController.mantenimientoInvernadero
// );

// router.patch(
//   '/:id/estado',
//   validateInvernaderoId,
//   handleInputErrors,
//   InvernaderoController.cambiarEstadoGenerico
// );

// ⚠️ Ruta comentada porque no hay un controlador para la zona en el archivo proporcionado
// router.get(
//   '/:id/zonas',
//   validateInvernaderoId,
//   handleInputErrors,
//   zonaController.getZonasPorInvernadero
// );

export default router;
