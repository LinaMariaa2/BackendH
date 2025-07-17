"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// autenticacion jwt
const authMiddleware = (req, res, next) => {
    const DESACTIVAR_AUTH = true; // ⚠️ cambia a false cuando quieras volver a activarlo
    if (DESACTIVAR_AUTH) {
        req.user = { id: 1, rol: 'admin', isVerified: true }; // Simula un usuario autenticado
        return next();
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token o formato incorrecto.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('Error al verificar token:', error);
        return res.status(403).json({ error: 'Token inválido o expirado. Por favor, inicia sesión de nuevo.' });
    }
};
exports.authMiddleware = authMiddleware;
//autirizacion basada en roles
const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'No autenticado. Información de usuario no disponible.' });
        }
        if (!allowedRoles.includes(req.user.rol)) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes los permisos necesarios para realizar esta acción.' });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=authMiddleware.js.map