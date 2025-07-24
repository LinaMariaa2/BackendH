import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface UserPayload {
    id_persona: number;
    rol: 'admin' | 'operario';
    isVerified: boolean;
   
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: UserPayload;
    }
}

const JWT_SECRET = process.env.JWT_SECRET as string;


export const authenticateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ error: 'Acceso denegado. No se proporcionó token de autenticación.' });
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!JWT_SECRET) {
        console.error("JWT_SECRET no está definida en las variables de entorno.");
        res.status(500).json({ error: "Error de configuración del servidor." });
        return;
    }

    try {
        const user = await new Promise<UserPayload>((resolve, reject) => {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded as UserPayload);
            });
        });

        req.user = user;
        next();
    } catch (err: any) {
        console.error("Error al verificar token JWT:", err.message);
        res.status(403).json({ error: 'Token inválido o expirado.', details: err.message });
    }
};

export const authorizeRoles = (allowedRoles: Array<'admin' | 'operario'>) => {
    return (req: Request, res: Response, next: NextFunction) => {
   
        if (!req.user || !req.user.rol) {
            return res.status(401).json({ error: 'No autorizado. Se requiere autenticación.' });
        }

      
        if (!allowedRoles.includes(req.user.rol)) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes los permisos necesarios para esta acción.' });
        }
        next();
    };
};

