import { Router } from 'express';
import { NotificationController } from '../controllers/notificationesController';
import { validateTokenRegistration } from '../middlewares/notificacionesValidation';

const router = Router();

// Ruta para registrar un token. Pasa primero por el validador.
router.post(
  '/notifications/register',
  validateTokenRegistration,
  NotificationController.registerToken
);

// Ruta para obtener el historial de notificaciones
router.get(
  '/notifications/user/:id_persona',
  NotificationController.getNotificationsByUser
);

export default router;