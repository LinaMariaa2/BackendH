import { Request, Response } from 'express';
declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id_persona: number;
            rol: 'admin' | 'operario';
            isVerified: boolean;
        };
        file?: Express.Multer.File;
    }
}
export declare class UserController {
    static uploadProfilePhoto: (req: Request, res: Response) => Promise<Response>;
    static getAll: (req: Request, res: Response) => Promise<void>;
    static getAllActivos: (req: Request, res: Response) => Promise<void>;
    static getById: (req: Request, res: Response) => Promise<void>;
    static crearPersona: (req: Request, res: Response) => Promise<void>;
    static actualizarPersona: (req: Request, res: Response) => Promise<void>;
    private static actualizarEstadoPersona;
    static inactivarPersona: (req: Request, res: Response) => Promise<void>;
    static activarPersona: (req: Request, res: Response) => Promise<void>;
    static bloquearPersona: (req: Request, res: Response) => Promise<void>;
    static eliminarPersona: (req: Request, res: Response) => Promise<void>;
}
