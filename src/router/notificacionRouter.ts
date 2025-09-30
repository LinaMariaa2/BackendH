import { Router } from 'express';
import { visitaController } from '../controllers/visitaController';
import { NotificacionController } from "../controllers/notificacionController";

const router = Router();

// GET /api/notificaciones - Obtiene todas las visitas para ser mostradas como notificaciones
router.get('/', visitaController.obtenerTodas);

router.get("/todas", NotificacionController.getNotificaciones); // Obtener todas las notificaciones
router.post("/", NotificacionController.addNotificacion);       // Crear nueva notificación
router.patch("/:id/leida", NotificacionController.marcarLeida); // Marcar como leída

export default router;
