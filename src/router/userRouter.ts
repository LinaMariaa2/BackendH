import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';
import {
    validatePersonaId,
    validateAdminPersonaCreation, // Importado para la creación de usuarios por admin
    validateAdminPersonaUpdate,
    handleInputErrors
} from '../middlewares/userValidation';
import multer from 'multer';

// Importa RequestHandler de Express para un tipado más explícito
import { RequestHandler } from 'express';

const router = Router();

// Middleware para envolver funciones asíncronas y manejar errores
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

// Configuración de Multer para manejar la subida de archivos
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB
});

// Rutas de Gestión de Usuarios

// GET /api/users - Obtener todos los usuarios (Solo Admin)
router.get(
    '/',
    authMiddleware as RequestHandler,
    authorizeRoles(['admin']) as RequestHandler,
    asyncHandler(UserController.getAll)
);

// GET /api/users/activos - Obtener usuarios activos (Solo Admin)
router.get(
    '/activos',
    authMiddleware as RequestHandler,
    authorizeRoles(['admin']) as RequestHandler,
    asyncHandler(UserController.getAllActivos)
);

// GET /api/users/:id_persona - Obtener un usuario por ID (Admin o el propio usuario)
router.get(
    '/:id_persona',
    authMiddleware as RequestHandler,
    authorizeRoles(['admin', 'operario']) as RequestHandler, // Permitir que operarios vean su propio perfil
    [validatePersonaId, handleInputErrors] as RequestHandler[],
    asyncHandler(UserController.getById)
);

// POST /api/users - Crear un nuevo usuario (Solo Admin)
// Esta ruta es para que el administrador registre nuevas personas directamente
router.post(
    '/',
    authMiddleware as RequestHandler,
    authorizeRoles(['admin']) as RequestHandler,
    [validateAdminPersonaCreation, handleInputErrors] as RequestHandler[], // Aplicar validaciones de creación para admin
    asyncHandler(UserController.crearPersona)
);

// PUT /api/users/:id_persona - Actualizar un usuario (Solo Admin)
router.put(
    '/:id_persona',
    authMiddleware as RequestHandler,
    authorizeRoles(['admin']) as RequestHandler,
    [validatePersonaId, validateAdminPersonaUpdate, handleInputErrors] as RequestHandler[],
    asyncHandler(UserController.actualizarPersona)
);

// PUT /api/users/inactivar/:id_persona - Cambiar estado a inactivo (Solo Admin)
router.put(
    '/inactivar/:id_persona',
    authMiddleware as RequestHandler,
    authorizeRoles(['admin']) as RequestHandler,
    [validatePersonaId, handleInputErrors] as RequestHandler[],
    asyncHandler(UserController.inactivarPersona)
);

// PUT /api/users/activar/:id_persona - Cambiar estado a activo (Solo Admin)
router.put(
    '/activar/:id_persona',
    authMiddleware as RequestHandler,
    authorizeRoles(['admin']) as RequestHandler,
    [validatePersonaId, handleInputErrors] as RequestHandler[],
    asyncHandler(UserController.activarPersona)
);

// PUT /api/users/bloquear/:id_persona - Cambiar estado a bloqueado/mantenimiento (Solo Admin)
router.put(
    '/bloquear/:id_persona',
    authMiddleware as RequestHandler,
    authorizeRoles(['admin']) as RequestHandler,
    [validatePersonaId, handleInputErrors] as RequestHandler[],
    asyncHandler(UserController.bloquearPersona)
);

// DELETE /api/users/:id_persona - Eliminar un usuario (Solo Admin)
router.delete(
    '/:id_persona',
    authMiddleware as RequestHandler,
    authorizeRoles(['admin']) as RequestHandler,
    [validatePersonaId, handleInputErrors] as RequestHandler[],
    asyncHandler(UserController.eliminarPersona)
);

// POST /api/users/:id_persona/upload-photo - Subir foto de perfil (Admin o el propio Operario)
router.post(
    '/:id_persona/upload-photo',
    authMiddleware as RequestHandler,
    authorizeRoles(['admin', 'operario']) as RequestHandler, // Permitir que el propio operario suba su foto
    upload.single('profile_picture'), // 'profile_picture' debe coincidir con el nombre del campo en el FormData del frontend
    asyncHandler(UserController.uploadProfilePhoto)
);

export default router;
