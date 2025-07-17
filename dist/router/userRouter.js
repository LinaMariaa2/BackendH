"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/router/userRouter.ts
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userValidation_1 = require("../middlewares/userValidation");
const router = (0, express_1.Router)();
//Rutas de Gestión de Usuarios (TODAS Requieren Autenticación y Rol de 'admin') 
//  Obtener todas las Personas
router.get('/', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), UserController_1.UserController.getAll);
//  Obtener Personas Activas y Verificadas
router.get('/activos', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), UserController_1.UserController.getAllActivos);
// Mostrar Persona por ID
router.get('/:id_persona', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), ...userValidation_1.validatePersonaId, UserController_1.UserController.getById);
// Actualizar una Persona
router.put('/:id_persona', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), ...userValidation_1.validatePersonaId, ...userValidation_1.validateAdminPersonaUpdate, UserController_1.UserController.actualizarPersona);
// Rutas para Cambios de Estado 
router.put('/inactivar/:id_persona', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), ...userValidation_1.validatePersonaId, UserController_1.UserController.inactivarPersona);
router.put('/activar/:id_persona', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), ...userValidation_1.validatePersonaId, UserController_1.UserController.activarPersona);
router.put('/bloquear/:id_persona', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), ...userValidation_1.validatePersonaId, UserController_1.UserController.bloquearPersona);
// Eliminar Persona permanentemente
router.delete('/:id_persona', authMiddleware_1.authMiddleware, (0, authMiddleware_1.authorizeRoles)(['admin']), ...userValidation_1.validatePersonaId, UserController_1.UserController.eliminarPersona);
exports.default = router;
//# sourceMappingURL=userRouter.js.map