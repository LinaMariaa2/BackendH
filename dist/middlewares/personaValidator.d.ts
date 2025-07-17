import { Request, Response, NextFunction } from 'express';
export declare const validatePersonaCreation: import("express-validator").ValidationChain[];
export declare const validatePersonaUpdate: import("express-validator").ValidationChain[];
export declare const validatePersonaCorreoUnico: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const validatePersonaId: import("express-validator").ValidationChain[];
