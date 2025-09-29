// backend/routes/visitaRouter.ts
import { Router } from 'express';
import { visitaController } from '../controllers/visitaController';

const router = Router();

router.get('/buscar-por-identificacion/:identificacion', visitaController.buscarPorIdentificacion);

router.get('/', visitaController.obtenerTodas);
router.get('/:id', visitaController.obtenerPorId);
router.post('/crear', visitaController.crear);
router.put('/actualizar/:id', visitaController.actualizar);
router.delete('/eliminar/:id', visitaController.eliminar);

router.put('/marcar-leida/:id', visitaController.marcarComoLeida);
router.put('/marcar-todas-leidas', visitaController.marcarTodasComoLeidas);

export default router;
