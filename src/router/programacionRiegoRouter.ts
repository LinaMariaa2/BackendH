import { Router } from 'express';
import { PrograRiegoController } from '../controllers/prograRiegoController';
import { validarProgramacionRiego } from '../middlewares/validarProgramacionRiego';
import { handleInputErrors } from '../middlewares/validation';

const router = Router();

router.get('/zonas/activas', PrograRiegoController.getZonasRiegoActivasParaESP32);

router.patch('/:id/estado', async (req, res, next) => {
  try {
    await PrograRiegoController.cambiarEstadoProgramacion(req, res);
  } catch (err) {
    next(err);
  }
});
router.get('/zona/:id/futuras', async (req, res, next) => {
  try {
    await PrograRiegoController.getProgramacionesFuturasPorZonaR(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/', PrograRiegoController.getTodasLasProgramaciones);
router.get('/:id', PrograRiegoController.getProgramacionPorId);
router.post('/', validarProgramacionRiego, handleInputErrors, PrograRiegoController.crearProgramacion);
router.put('/:id', validarProgramacionRiego, handleInputErrors, PrograRiegoController.actualizarProgramacion);
router.delete('/:id', PrograRiegoController.eliminarProgramacion);

export default router;
