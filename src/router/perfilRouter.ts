import { Router, Request, Response, NextFunction } from 'express';
import { getOwnPerfil, actualizarPerfil } from '../controllers/PerfilController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware'; // Importa tus middlewares de autenticación
import { RequestHandler } from 'express'; // Para tipado explícito

const router = Router();

// Middleware para envolver funciones asíncronas y manejar errores
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

// Ruta para obtener el perfil del usuario autenticado
// Permitir que tanto admins como operarios vean su propio perfil
router.get(
    '/',
    authMiddleware as RequestHandler, // Autenticación requerida
    authorizeRoles(['admin', 'operario']) as RequestHandler, // Autorización para admin y operario
    asyncHandler(getOwnPerfil)
);

// Ruta para actualizar el perfil del usuario autenticado
// Permitir que tanto admins como operarios actualicen su propio perfil
router.put(
    '/update',
    authMiddleware as RequestHandler, // Autenticación requerida
    authorizeRoles(['admin', 'operario']) as RequestHandler, // Autorización para admin y operario
    asyncHandler(actualizarPerfil)
);

export default router;
