import { Request, Response } from 'express';
export declare class PrograRiegoController {
    static getTodasLasProgramaciones: (_req: Request, res: Response) => Promise<void>;
    static getProgramacionPorId: (req: Request, res: Response) => Promise<void>;
    static crearProgramacion: (req: Request, res: Response) => Promise<void>;
    static actualizarProgramacion: (req: Request, res: Response) => Promise<void>;
    static eliminarProgramacion: (req: Request, res: Response) => Promise<void>;
    static getZonasRiegoActivasParaESP32: (_req: Request, res: Response) => Promise<void>;
}
