import { Router } from 'express';
import { PersonaController } from '../controllers/personaControllers';
import { validatePersonaId } from '../middlewares/personaValidator';
import { handleInputErrors } from '../middlewares/validation';
import { query } from 'express-validator';

const router = Router();

router.get('/', PersonaController.getAll);

router.get('/activos', PersonaController.getAllActivos);

router.get('/operarios', PersonaController.getOperarios);

router.get('/:id', validatePersonaId, handleInputErrors, PersonaController.getById);

export default router;
