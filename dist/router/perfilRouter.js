"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PerfilController_1 = require("../controllers/PerfilController");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Importa tus middlewares de autenticación
const router = (0, express_1.Router)();
// Middleware para envolver funciones asíncronas y manejar errores
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
// Ruta para obtener el perfil del usuario autenticado
// Permitir que tanto admins como operarios vean su propio perfil
router.get('/', authMiddleware_1.authMiddleware, // Autenticación requerida
(0, authMiddleware_1.authorizeRoles)(['admin', 'operario']), // Autorización para admin y operario
asyncHandler(PerfilController_1.getOwnPerfil));
// Ruta para actualizar el perfil del usuario autenticado
// Permitir que tanto admins como operarios actualicen su propio perfil
router.put('/update', authMiddleware_1.authMiddleware, // Autenticación requerida
(0, authMiddleware_1.authorizeRoles)(['admin', 'operario']), // Autorización para admin y operario
asyncHandler(PerfilController_1.actualizarPerfil));
exports.default = router;
//# sourceMappingURL=perfilRouter.js.map