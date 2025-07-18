// src/router/authRouter.ts
import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/AuthController';
import {
    validateLogin,
    validateVerifyCode,
    validateResendCode,
    validateRegistration,
} from '../middlewares/userValidation'; // Asumo que userValidation.ts es correcto y existe

const router = Router();

type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void;

// Ruta de LOGIN
router.post(
    '/login',
    ...validateLogin as ExpressMiddleware[],
    (req: Request, res: Response, next: NextFunction) => {
        AuthController.login(req, res).catch(next); // Llama al controlador y pasa cualquier error a 'next'
    }
);

// Ruta de REGISTRO
router.post(
    '/register',
    ...validateRegistration as ExpressMiddleware[],
    (req: Request, res: Response, next: NextFunction) => {
        AuthController.register(req, res).catch(next); // Llama al controlador y pasa cualquier error a 'next'
    }
);

// Ruta para VERIFICAR CÓDIGO
router.post(
    '/verify-email',
    ...validateVerifyCode as ExpressMiddleware[],
    (req: Request, res: Response, next: NextFunction) => {
        AuthController.verifyEmailCode(req, res).catch(next); // Llama al controlador y pasa cualquier error a 'next'
    }
);

// Ruta para REENVIAR CÓDIGO
router.post(
    '/resend-verification-code',
    ...validateResendCode as ExpressMiddleware[],
    (req: Request, res: Response, next: NextFunction) => {
        AuthController.resendVerificationCode(req, res).catch(next); // Llama al controlador y pasa cualquier error a 'next'
    }
);

export default router;