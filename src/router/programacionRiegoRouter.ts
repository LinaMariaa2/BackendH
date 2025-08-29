import { Router } from 'express';
import { PrograRiegoController } from '../controllers/prograRiegoController';
import { validarProgramacionRiego } from '../middlewares/validarProgramacionRiego';
import { handleInputErrors } from '../middlewares/validation';

const router = Router();

// Rutas de Programación de Riego
router.get('/zonas/activas', PrograRiegoController.getZonasRiegoActivasParaESP32);
router.patch('/:id/estado', PrograRiegoController.cambiarEstadoProgramacion);
router.get('/zona/:id/futuras', PrograRiegoController.getProgramacionesFuturasPorZonaR);
router.get('/', PrograRiegoController.getTodasLasProgramaciones);
router.get('/:id', PrograRiegoController.getProgramacionPorId);
router.post(
  '/',
  validarProgramacionRiego,
  handleInputErrors,
  PrograRiegoController.crearProgramacion
);
router.put(
  '/:id',
  validarProgramacionRiego,
  handleInputErrors,
  PrograRiegoController.actualizarProgramacion
);
router.delete('/:id', PrograRiegoController.eliminarProgramacion);

export default router;
