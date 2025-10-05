import { Router } from 'express';
import { NotificacionController } from "../controllers/notificacionController";
import { authenticateJWT } from '../middlewares/authMiddleware'; // ✨ 1. IMPORTA TU MIDDLEWARE DE AUTENTICACIÓN

const router = Router();


router.get("/", authenticateJWT, NotificacionController.getMisNotificaciones);


// 🔹 Endpoints generales
router.get("/todas", NotificacionController.getNotificaciones);
router.post("/", NotificacionController.addNotificacion);
router.patch("/:id/leida", NotificacionController.marcarLeida);
router.put("/marcar-todas-leidas", NotificacionController.marcarTodasLeidas);

// 🔹 Endpoints por rol
router.get("/operario", NotificacionController.getNotificacionesOperario);
router.get("/admin", NotificacionController.getNotificacionesAdmin);

export default router;