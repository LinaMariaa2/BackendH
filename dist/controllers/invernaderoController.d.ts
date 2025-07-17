import type { Request, Response } from 'express';
export declare class invernaderoController {
    static getAll: (req: Request, res: Response) => Promise<void>;
    static getAllActivos: (req: Request, res: Response) => Promise<void>;
    static getId: (req: Request, res: Response) => Promise<void>;
    static crearInvernadero: (req: Request, res: Response) => Promise<void>;
    static cambiarEstadoGenerico: (req: Request, res: Response) => Promise<void>;
    static actualizarInvernadero: (req: Request, res: Response) => Promise<void>;
    static inactivarInvernadero: (req: Request, res: Response) => Promise<void>;
    static activarInvernadero: (req: Request, res: Response) => Promise<void>;
    static mantenimientoInvernadero: (req: Request, res: Response) => Promise<void>;
    static eliminarInvernadero: (req: Request, res: Response) => Promise<void>;
}
