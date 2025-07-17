"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userValidation_1 = require("../middlewares/userValidation");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
// Middleware para envolver funciones asíncronas y manejar errores
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
// Configuración de Multer para manejar la subida de archivos
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB
});
// Rutas de Gestión de Usuarios
// GET /api/users - Obtener todos los usuarios (Solo Admin)
router.get('/', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), asyncHandler(UserController_1.UserController.getAll));
// GET /api/users/activos - Obtener usuarios activos (Solo Admin)
router.get('/activos', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), asyncHandler(UserController_1.UserController.getAllActivos));
// GET /api/users/:id_persona - Obtener un usuario por ID (Admin o el propio usuario)
router.get('/:id_persona', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin', 'operario']), // Permitir que operarios vean su propio perfil
[userValidation_1.validatePersonaId, userValidation_1.handleInputErrors], asyncHandler(UserController_1.UserController.getById));
// POST /api/users - Crear un nuevo usuario (Solo Admin)
// Esta ruta es para que el administrador registre nuevas personas directamente
router.post('/', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), [userValidation_1.validateAdminPersonaCreation, userValidation_1.handleInputErrors], // Aplicar validaciones de creación para admin
asyncHandler(UserController_1.UserController.crearPersona));
// PUT /api/users/:id_persona - Actualizar un usuario (Solo Admin)
router.put('/:id_persona', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), [userValidation_1.validatePersonaId, userValidation_1.validateAdminPersonaUpdate, userValidation_1.handleInputErrors], asyncHandler(UserController_1.UserController.actualizarPersona));
// PUT /api/users/inactivar/:id_persona - Cambiar estado a inactivo (Solo Admin)
router.put('/inactivar/:id_persona', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), [userValidation_1.validatePersonaId, userValidation_1.handleInputErrors], asyncHandler(UserController_1.UserController.inactivarPersona));
// PUT /api/users/activar/:id_persona - Cambiar estado a activo (Solo Admin)
router.put('/activar/:id_persona', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), [userValidation_1.validatePersonaId, userValidation_1.handleInputErrors], asyncHandler(UserController_1.UserController.activarPersona));
// PUT /api/users/bloquear/:id_persona - Cambiar estado a bloqueado/mantenimiento (Solo Admin)
router.put('/bloquear/:id_persona', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), [userValidation_1.validatePersonaId, userValidation_1.handleInputErrors], asyncHandler(UserController_1.UserController.bloquearPersona));
// DELETE /api/users/:id_persona - Eliminar un usuario (Solo Admin)
router.delete('/:id_persona', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), [userValidation_1.validatePersonaId, userValidation_1.handleInputErrors], asyncHandler(UserController_1.UserController.eliminarPersona));
// POST /api/users/:id_persona/upload-photo - Subir foto de perfil (Admin o el propio Operario)
router.post('/:id_persona/upload-photo', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin', 'operario']), // Permitir que el propio operario suba su foto
upload.single('profile_picture'), // 'profile_picture' debe coincidir con el nombre del campo en el FormData del frontend
asyncHandler(UserController_1.UserController.uploadProfilePhoto));
exports.default = router;
//# sourceMappingURL=userRouter.js.map