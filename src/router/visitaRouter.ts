import { Router } from 'express';
import { visitaController } from '../controllers/visitaController';

const router = Router();

router.get('/', visitaController.getAll);
router.get('/:id', visitaController.getById);
router.post('/', visitaController.crear);
router.put('/:id', visitaController.actualizar);
router.delete('/:id', visitaController.eliminar);
router.patch('/:id/estado', visitaController.cambiarEstado);

export default router;
