
import { Router } from 'express';
import { gestionCultivoController } from '../controllers/gestionarCultivoController';
import { validateCultivoBody, validateCultivoId } from '../middlewares/gestionarCultivoValidation';
import { handleInputErrors } from '../middlewares/validation';

const router = Router();
router.get('/operario/:id_operario', gestionCultivoController.getPorOperario);
router.get('/zona/:id_zona', gestionCultivoController.getPorZona);

router.get('/', gestionCultivoController.getAll);
router.get('/:id', validateCultivoId, handleInputErrors, gestionCultivoController.getId);
router.patch('/:id/estado/:estado', validateCultivoId, handleInputErrors, gestionCultivoController.cambiarEstado);
router.patch('/:id', validateCultivoId, handleInputErrors,gestionCultivoController.actualizarProduccion);
router.put(
  '/:id',
  validateCultivoId,
  validateCultivoBody,
  handleInputErrors,
  gestionCultivoController.actualizarCultivo
);

router.post('/', validateCultivoBody, handleInputErrors, gestionCultivoController.crearCultivo);
router.delete('/:id', validateCultivoId, handleInputErrors, gestionCultivoController.eliminarCultivo);



export default router;
