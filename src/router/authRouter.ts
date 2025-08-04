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

// Rutas de registro y login existentes
router.post(
    '/login',
    ...validateLogin as ExpressMiddleware[],
    (req: Request, res: Response, next: NextFunction) => {
        AuthController.login(req, res).catch(next);
    }
);

router.post(
    '/register',
    ...validateRegistration as ExpressMiddleware[],
    (req: Request, res: Response, next: NextFunction) => {
        AuthController.register(req, res).catch(next);
    }
);

router.post(
    '/verify-email',
    ...validateVerifyCode as ExpressMiddleware[],
    (req: Request, res: Response, next: NextFunction) => {
        AuthController.verifyEmailCode(req, res).catch(next);
    }
);

router.post(
    '/resend-verification-code',
    ...validateResendCode as ExpressMiddleware[],
    (req: Request, res: Response, next: NextFunction) => {
        AuthController.resendVerificationCode(req, res).catch(next);
    }
);

// NUEVAS RUTAS para la recuperación de contraseña
// Puedes crear nuevos middlewares de validación para estas rutas si lo deseas.
router.post('/send-reset-code', (req: Request, res: Response, next: NextFunction) => {
    AuthController.sendPasswordResetCode(req, res).catch(next);
});

router.post('/verify-reset-code', (req: Request, res: Response, next: NextFunction) => {
    AuthController.verifyPasswordResetCode(req, res).catch(next);
});

router.post('/reset-password', (req: Request, res: Response, next: NextFunction) => {
    AuthController.resetPassword(req, res).catch(next);
});

export default router;