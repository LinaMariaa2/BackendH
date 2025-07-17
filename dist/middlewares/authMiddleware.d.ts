import { Request, Response, NextFunction } from 'express';
declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id: number;
            rol: string;
            isVerified: boolean;
        };
    }
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => void | Response<any>;
export declare const authorizeRoles: (allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => void | Response<any>;
