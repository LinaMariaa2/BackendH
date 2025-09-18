import { Router } from 'express';
import { visitaController } from '../controllers/visitaController';

const router = Router();

// Rutas CRUD
router.get('/', visitaController.obtenerTodas);
router.get('/:id', visitaController.obtenerPorId);
router.post('/crear', visitaController.crear);
router.put('/actualizar/:id', visitaController.actualizar);
router.delete('/eliminar/:id', visitaController.eliminar);

// Otras rutas
router.put('/marcar-leida/:id', visitaController.marcarComoLeida);
router.put('/marcar-todas-leidas', visitaController.marcarTodasComoLeidas);

export default router;
