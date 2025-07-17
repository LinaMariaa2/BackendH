"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
// src/config/nodemailerConfig.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
// No necesitas dotenv aquí si ya lo cargas en index.ts
// import dotenv from 'dotenv';
// dotenv.config();
exports.transporter = nodemailer_1.default.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
exports.transporter.verify((error, success) => {
    if (error) {
        console.error('Error al conectar con el servidor de correo:', error);
        console.error('Por favor, revisa tus variables de entorno EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS en .env.');
    }
    else {
        console.log('Servidor de correo listo para enviar mensajes.');
    }
});
//# sourceMappingURL=nodemailerConfig.js.map