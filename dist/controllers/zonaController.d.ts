import type { Request, Response } from 'express';
export declare class zonaController {
    static getAll: (_req: Request, res: Response) => Promise<void>;
    static getAllActivos: (_req: Request, res: Response) => Promise<void>;
    static getZonasPorInvernadero: (req: Request, res: Response) => Promise<void>;
    static crearZona: (req: Request, res: Response) => Promise<void>;
    static actualizarZona: (req: Request, res: Response) => Promise<void>;
    static cambiarEstadoGenerico: (req: Request, res: Response) => Promise<void>;
    static inactivarZona: (req: Request, res: Response) => Promise<void>;
    static activarZona: (req: Request, res: Response) => Promise<void>;
    static mantenimientoZona: (req: Request, res: Response) => Promise<void>;
    static eliminarZona: (req: Request, res: Response) => Promise<void>;
}
