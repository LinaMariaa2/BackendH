import { Request, Response, NextFunction } from 'express';
declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id_persona: number;
            rol: 'admin' | 'operario';
            isVerified: boolean;
        };
    }
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => void | Response<any>;
export declare const authorizeRoles: (allowedRoles: Array<"admin" | "operario">) => (req: Request, res: Response, next: NextFunction) => void | Response<any>;
