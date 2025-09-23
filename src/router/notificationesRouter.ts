import { Router } from 'express';
import { NotificationController } from '../controllers/notificationesController';
import { validateTokenRegistration } from '../middlewares/notificacionesValidation';

const router = Router();

// ANTES: router.post('/notifications/register', ...);
// AHORA, la ruta es solo '/register' porque la base ya está en server.ts
router.post(
  '/register', // <-- ESTA ES LA CORRECCIÓN
  validateTokenRegistration,
  NotificationController.registerToken
);

router.get(
  '/user/:id_persona', // <-- ESTA ES LA CORRECCIÓN
  NotificationController.getNotificationsByUser
);

export default router;