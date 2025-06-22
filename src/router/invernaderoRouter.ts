import { Router } from 'express';
import { invernaderoController } from '../controllers/invernaderoController';
import { validateInvernaderoId, validateInvernaderoNombreUnico, validateInvernaderoBody} from '../middlewares/invernaderoValidator';
import { handleInputErrors } from '../middlewares/validation';

const router = Router();

router.get('/', invernaderoController.getAll);

router.get(
  '/:id',
  validateInvernaderoId,
  handleInputErrors,
  invernaderoController.getId
);

router.post(
  '/',
  validateInvernaderoBody,
  validateInvernaderoNombreUnico,
  handleInputErrors,
  invernaderoController.crearInvernadero
);

router.put(
  '/:id',
  validateInvernaderoId,
  validateInvernaderoBody,
  validateInvernaderoNombreUnico,
  handleInputErrors,
  invernaderoController.actualizarInvernadero
);

router.delete(
  '/:id',
  validateInvernaderoId,
  handleInputErrors,
  invernaderoController.eliminarInvernadero
);


export default router;
