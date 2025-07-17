"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware de autenticación JWT
const authMiddleware = (req, res, next) => {
    //para trabajar en desarrollo y qu eno ponga problema por la autenticacion
    const DESACTIVAR_AUTH = true; // ⚠️ cambia a false cuando quieras volver a activarlo
    if (DESACTIVAR_AUTH) {
        req.user = { id_persona: 1, rol: 'admin', isVerified: true }; // Simula un usuario autenticado
        return next();
    }
    console.log('DEBUG: Entrando a authMiddleware');
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('DEBUG: authMiddleware - No se proporcionó token o formato incorrecto.');
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token o formato incorrecto.' });
    }
    const token = authHeader.split(' ')[1];
    console.log('DEBUG: authMiddleware - Token recibido:', token ? token.substring(0, 30) + '...' : 'N/A');
    try {
        if (!process.env.JWT_SECRET) {
            console.error('DEBUG: authMiddleware - JWT_SECRET no está definido en las variables de entorno.');
            return res.status(500).json({ error: 'Error de configuración del servidor: JWT_SECRET no definido.' });
        }
        // El payload del token debe coincidir con la interfaz de req.user
        // Asegúrate de que cuando generas el token (ej. en tu login/registro),
        // incluyas id_persona, rol e isVerified.
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adjunta la información del usuario al objeto de solicitud
        console.log('DEBUG: authMiddleware - Token verificado exitosamente. Usuario:', req.user.id_persona, 'Rol:', req.user.rol);
        next();
    }
    catch (error) {
        console.error('DEBUG: authMiddleware - Error al verificar token:', error);
        // Manejo específico para token expirado
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(403).json({ error: 'Token expirado. Por favor, inicia sesión de nuevo.' });
        }
        return res.status(403).json({ error: 'Token inválido. Por favor, inicia sesión de nuevo.' });
    }
};
exports.authMiddleware = authMiddleware;
// Middleware de autorización basado en roles
const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        console.log('DEBUG: Entrando a authorizeRoles. Roles permitidos:', allowedRoles);
        if (!req.user) {
            // Esto no debería ocurrir si authMiddleware se ejecuta antes, pero es una buena salvaguarda
            console.log('DEBUG: authorizeRoles - Usuario no autenticado (req.user no disponible).');
            return res.status(401).json({ error: 'No autenticado. Información de usuario no disponible.' });
        }
        // Comprueba si el rol del usuario está en la lista de roles permitidos
        if (!allowedRoles.includes(req.user.rol)) {
            console.log('DEBUG: authorizeRoles - Acceso denegado. Rol del usuario:', req.user.rol);
            return res.status(403).json({ error: 'Acceso denegado. No tienes los permisos necesarios para realizar esta acción.' });
        }
        console.log('DEBUG: authorizeRoles - Autorización exitosa para el rol:', req.user.rol);
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=authMiddleware.js.map