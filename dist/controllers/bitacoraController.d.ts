import { Request, Response } from 'express';
export declare class bitacoraController {
    static getAll: (req: Request, res: Response) => Promise<void>;
    static getById: (req: Request, res: Response) => Promise<void>;
    static crear: (req: Request, res: Response) => Promise<void>;
    static actualizar: (req: Request, res: Response) => Promise<void>;
    static eliminar: (req: Request, res: Response) => Promise<void>;
    static getByInvernadero: (req: Request, res: Response) => Promise<void>;
    static archivar: (req: Request, res: Response) => Promise<void>;
    static desarchivar: (req: Request, res: Response) => Promise<void>;
}
