import { Router } from 'express';
import { PrograRiegoController } from '../controllers/PrograRiegoController';
import { validarProgramacionRiego } from '../middlewares/validarProgramacionRiego';
import { handleInputErrors } from '../middlewares/validation';

const router = Router();

router.get('/zonas/activas', PrograRiegoController.getZonasRiegoActivasParaESP32);
router.get('/', PrograRiegoController.getTodasLasProgramaciones);
router.get('/:id', PrograRiegoController.getProgramacionPorId);
router.post('/', validarProgramacionRiego, handleInputErrors, PrograRiegoController.crearProgramacion);
router.put('/:id', validarProgramacionRiego, handleInputErrors, PrograRiegoController.actualizarProgramacion);
router.delete('/:id', PrograRiegoController.eliminarProgramacion);

export default router;
