import { Request, Response } from 'express';
export declare class PrograIluminController {
    static getTodasLasProgramaciones: (_req: Request, res: Response) => Promise<void>;
    static getProgramacionPorId: (req: Request, res: Response) => Promise<void>;
    static crearProgramacion: (req: Request, res: Response) => Promise<void>;
    static actualizarProgramacion: (req: Request, res: Response) => Promise<void>;
    static eliminarProgramacion: (req: Request, res: Response) => Promise<void>;
    static getZonasActivasParaESP32: (_req: Request, res: Response) => Promise<void>;
}
