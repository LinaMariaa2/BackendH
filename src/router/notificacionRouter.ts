import { Router } from 'express';
import { NotificacionController } from "../controllers/notificacionController";

const router = Router();

// 🔹 Endpoints generales
router.get("/todas", NotificacionController.getNotificaciones);
router.post("/", NotificacionController.addNotificacion);
router.patch("/:id/leida", NotificacionController.marcarLeida);
router.put("/marcar-todas-leidas", NotificacionController.marcarTodasLeidas);

// 🔹 Endpoints por rol
router.get("/operario", NotificacionController.getNotificacionesOperario);
router.get("/admin", NotificacionController.getNotificacionesAdmin);

export default router;
