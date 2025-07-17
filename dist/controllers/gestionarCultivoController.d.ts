import type { Request, Response } from 'express';
export declare class gestionCultivoController {
    static getAll: (_req: Request, res: Response) => Promise<void>;
    static getId: (req: Request, res: Response) => Promise<void>;
    static cambiarEstado: (req: Request, res: Response) => Promise<void>;
    static getPorZona: (req: Request, res: Response) => Promise<void>;
    static crearCultivo: (req: Request, res: Response) => Promise<void>;
    static eliminarCultivo: (req: Request, res: Response) => Promise<void>;
    static actualizarCultivo: (req: Request, res: Response) => Promise<void>;
}
