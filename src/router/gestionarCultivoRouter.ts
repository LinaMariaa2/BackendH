
import { Router } from 'express';
import { gestionCultivoController } from '../controllers/gestionarCultivoController';
import { validateCultivoBody, validateCultivoId } from '../middlewares/gestionarCultivoValidation';
import { handleInputErrors } from '../middlewares/validation';

const router = Router();
router.get('/zona/:id_zona', gestionCultivoController.getPorZona);
router.get('/', gestionCultivoController.getAll);
router.get('/:id', validateCultivoId, handleInputErrors, gestionCultivoController.getId);
router.patch('/:id/estado/:estado', validateCultivoId, handleInputErrors, gestionCultivoController.cambiarEstado);


router.post('/', validateCultivoBody, handleInputErrors, gestionCultivoController.crearCultivo);


export default router;
