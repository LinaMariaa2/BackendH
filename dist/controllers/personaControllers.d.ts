import type { Request, Response } from 'express';
export declare class PersonaController {
    static getAll: (req: Request, res: Response) => Promise<void>;
    static getOperarios: (req: Request, res: Response) => Promise<void>;
    static getAllActivos: (req: Request, res: Response) => Promise<void>;
    static getById(req: Request, res: Response): Promise<void>;
    static crearPersona: (req: Request, res: Response) => Promise<void>;
    static actualizarPersona: (req: Request, res: Response) => Promise<void>;
    static inactivarPersona: (req: Request, res: Response) => Promise<void>;
    static activarPersona: (req: Request, res: Response) => Promise<void>;
    static bloquearPersona: (req: Request, res: Response) => Promise<void>;
    static eliminarPersona: (req: Request, res: Response) => Promise<void>;
}
