import { Router } from 'express';
import { zonaController } from '../controllers/zonaController';
import {
  validateZonaId,
  validateZonaNombreUnico,
  validateZonaBody,
  validateInvernaderoExistente,
} from '../middlewares/zonaValidator';
import { handleInputErrors } from '../middlewares/validation';

const router = Router();

router.get('/', zonaController.getAll);
router.get('/activos', zonaController.getAllActivos);
router.get('/datos-activos', zonaController.getDatosActivos);
router.get('/invernadero/:id', zonaController.getZonasPorInvernadero);
router.get('/estadisticas', zonaController.getEstadisticasZonas); 

router.post(
  '/',
  validateZonaBody,
  validateZonaNombreUnico,
  validateInvernaderoExistente,
  handleInputErrors,
  zonaController.crearZona
);

router.put(
  '/:id_zona',
  validateZonaId,
  validateZonaBody,
  validateZonaNombreUnico,
  handleInputErrors,
  zonaController.actualizarZona
);

router.patch('/cambiar-estado/:id_zona', zonaController.cambiarEstadoGenerico);

router.patch('/inactivar/:id_zona', validateZonaId, handleInputErrors, zonaController.inactivarZona);
router.patch('/activar/:id_zona', validateZonaId, handleInputErrors, zonaController.activarZona);
router.patch('/mantenimiento/:id_zona', validateZonaId, handleInputErrors, zonaController.mantenimientoZona);

router.delete('/:id_zona', validateZonaId, handleInputErrors, zonaController.eliminarZona);

export default router;