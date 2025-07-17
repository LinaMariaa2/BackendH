import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extendemos la interfaz Request de Express para añadir nuestra propiedad 'user'
// Esto es crucial para que TypeScript reconozca req.user en tus rutas y middlewares
declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id_persona: number; // Cambiado de 'id' a 'id_persona' para coincidir con tu modelo Persona
            rol: 'admin' | 'operario'; // Tipado más específico para el rol
            isVerified: boolean;
        };
    }
}

// Middleware de autenticación JWT
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void | Response<any> => {
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id_persona: number;
            rol: 'admin' | 'operario';
            isVerified: boolean;
            iat: number; // Issued At
            exp: number; // Expiration Time
        };
        req.user = decoded; // Adjunta la información del usuario al objeto de solicitud
        console.log('DEBUG: authMiddleware - Token verificado exitosamente. Usuario:', req.user.id_persona, 'Rol:', req.user.rol);
        next();
    } catch (error) {
        console.error('DEBUG: authMiddleware - Error al verificar token:', error);
        // Manejo específico para token expirado
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(403).json({ error: 'Token expirado. Por favor, inicia sesión de nuevo.' });
        }
        return res.status(403).json({ error: 'Token inválido. Por favor, inicia sesión de nuevo.' });
    }
};

// Middleware de autorización basado en roles
export const authorizeRoles = (allowedRoles: Array<'admin' | 'operario'>) => { // Tipado más específico para el array de roles
    return (req: Request, res: Response, next: NextFunction): void | Response<any> => {
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
