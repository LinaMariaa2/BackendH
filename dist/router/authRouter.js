"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/router/authRouter.ts
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const userValidation_1 = require("../middlewares/userValidation"); // Asumo que userValidation.ts es correcto y existe
const router = (0, express_1.Router)();
// Ruta de LOGIN
router.post('/login', ...userValidation_1.validateLogin, (req, res, next) => {
    AuthController_1.AuthController.login(req, res).catch(next); // Llama al controlador y pasa cualquier error a 'next'
});
// Ruta de REGISTRO
router.post('/register', ...userValidation_1.validateRegistration, (req, res, next) => {
    AuthController_1.AuthController.register(req, res).catch(next); // Llama al controlador y pasa cualquier error a 'next'
});
// Ruta para VERIFICAR CÓDIGO
router.post('/verify-email', ...userValidation_1.validateVerifyCode, (req, res, next) => {
    AuthController_1.AuthController.verifyEmailCode(req, res).catch(next); // Llama al controlador y pasa cualquier error a 'next'
});
// Ruta para REENVIAR CÓDIGO
router.post('/resend-verification-code', ...userValidation_1.validateResendCode, (req, res, next) => {
    AuthController_1.AuthController.resendVerificationCode(req, res).catch(next); // Llama al controlador y pasa cualquier error a 'next'
});
exports.default = router;
//# sourceMappingURL=authRouter.js.map