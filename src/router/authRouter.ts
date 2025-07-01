// src/router/authRouter.ts
import { Router, Request, Response, NextFunction } from 'express'; 
import { AuthController } from '../controllers/AuthController';
import {
    validateLogin,
    validateVerifyCode,
    validateResendCode,
    validateRegistration,
  
} from '../middlewares/userValidation'; 

const router = Router();

type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void;

//Ruta de LOGIN 
router.post(
    '/login',
    ...validateLogin as ExpressMiddleware[], // <-- APLICAR ESTE CASTEO
    AuthController.login
);

// Ruta de REGISTRO 
router.post(
    '/register',
    ...validateRegistration as ExpressMiddleware[], // <-- APLICAR ESTE CASTEO
    AuthController.register
);

// Ruta para VERIFICAR CÓDIGO 
router.post(
    '/verify-email',
    ...validateVerifyCode as ExpressMiddleware[], // <-- APLICAR ESTE CASTEO
    AuthController.verifyEmailCode
);

// Ruta para REENVIAR CÓDIGO
router.post(
    '/resend-verification-code',
    ...validateResendCode as ExpressMiddleware[], // <-- APLICAR ESTE CASTEO
    AuthController.resendVerificationCode
);



export default router;