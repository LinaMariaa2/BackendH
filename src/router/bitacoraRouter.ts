import { Router } from 'express';
import { bitacoraController } from '../controllers/bitacoraController';
import {validacionBitacoraBody,validacionIdBitacora} from '../middlewares/bitacoraValidation';
import { handleInputErrors } from '../middlewares/validation';

const router = Router();

router.get('/', bitacoraController.getAll);

router.get('/:id',
    validacionIdBitacora, 
    handleInputErrors, 
    bitacoraController.getById);

router.post('/', validacionBitacoraBody, handleInputErrors, bitacoraController.crear);
router.put('/:id', validacionIdBitacora, validacionBitacoraBody, handleInputErrors, bitacoraController.actualizar);
router.delete('/:id', validacionIdBitacora, handleInputErrors, bitacoraController.eliminar);
router.get('/invernadero/:id_invernadero', bitacoraController.getByInvernadero);
router.patch('/:id/archivar', validacionIdBitacora, handleInputErrors, bitacoraController.archivar);
router.patch('/:id/desarchivar', validacionIdBitacora, handleInputErrors, bitacoraController.desarchivar);


export default router;
