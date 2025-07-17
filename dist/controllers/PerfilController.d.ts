import { Request, Response } from 'express';
declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id_persona: number;
            rol: 'admin' | 'operario';
            isVerified: boolean;
        };
    }
}
export declare const getOwnPerfil: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const actualizarPerfil: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
