import { Router } from 'express';
import { PrograIluminController } from '../controllers/prograIluminController';
import { validarProgramacion } from '../middlewares/validarProgramacionIlum';
import { handleInputErrors } from '../middlewares/validation';

const router = Router();

// 🟢 Rutas específicas primero
router.get('/zonas/activas', PrograIluminController.getZonasActivasParaESP32);
router.patch('/:id/estado', async (req, res, next) => {
  try {
    await PrograIluminController.cambiarEstadoProgramacion(req, res);
  } catch (err) {
    next(err);
  }
});

router.get('/zona/:id/futuras', async (req, res, next) => {
  try {
    await PrograIluminController.getProgramacionesFuturasPorZona(req, res);
  } catch (error) {
    next(error);
  }
});


// 🟡 Rutas generales después
router.get('/', PrograIluminController.getTodasLasProgramaciones);
router.get('/:id', PrograIluminController.getProgramacionPorId);
router.post('/', validarProgramacion, handleInputErrors, PrograIluminController.crearProgramacion);
router.put('/:id', validarProgramacion, handleInputErrors, PrograIluminController.actualizarProgramacion);
router.delete('/:id', PrograIluminController.eliminarProgramacion);



export default router;