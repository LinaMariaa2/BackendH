import { Request, Response } from 'express';
import Persona from '../models/Persona';
export declare class AuthController {
    private static readonly JWT_SECRET;
    private static readonly JWT_EXPIRES_IN;
    static sendVerificationCode(user: Persona): Promise<void>;
    static register: (req: Request, res: Response) => Promise<void>;
    static login: (req: Request, res: Response) => Promise<void>;
    static createPersonaByAdmin: (req: Request, res: Response) => Promise<void>;
    static verifyEmailCode: (req: Request, res: Response) => Promise<void>;
    static resendVerificationCode(req: Request, res: Response): Promise<void>;
}
