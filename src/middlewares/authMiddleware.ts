import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare module 'express-serve-static-core' {
    interface Request {
        user?: { 
            id: number;
            rol: string;
            isVerified: boolean;
        };
    }
}

// autenticacion jwt

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void | Response<any> => {
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number, rol: string, isVerified: boolean };
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error al verificar token:', error);
        return res.status(403).json({ error: 'Token inválido o expirado. Por favor, inicia sesión de nuevo.' });
    }
};

//autirizacion basada en roles
export const authorizeRoles = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void | Response<any> => {
        if (!req.user) {
           
            return res.status(401).json({ error: 'No autenticado. Información de usuario no disponible.' });
        }

        if (!allowedRoles.includes(req.user.rol)) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes los permisos necesarios para realizar esta acción.' });
        }
        next();
    };
};
