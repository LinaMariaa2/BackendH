"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/router/authRouter.ts
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const userValidation_1 = require("../middlewares/userValidation");
const router = (0, express_1.Router)();
//Ruta de LOGIN 
router.post('/login', ...userValidation_1.validateLogin, // <-- APLICAR ESTE CASTEO
AuthController_1.AuthController.login);
// Ruta de REGISTRO 
router.post('/register', ...userValidation_1.validateRegistration, // <-- APLICAR ESTE CASTEO
AuthController_1.AuthController.register);
// Ruta para VERIFICAR CÓDIGO 
router.post('/verify-email', ...userValidation_1.validateVerifyCode, // <-- APLICAR ESTE CASTEO
AuthController_1.AuthController.verifyEmailCode);
// Ruta para REENVIAR CÓDIGO
router.post('/resend-verification-code', ...userValidation_1.validateResendCode, // <-- APLICAR ESTE CASTEO
AuthController_1.AuthController.resendVerificationCode);
exports.default = router;
//# sourceMappingURL=authRouter.js.map