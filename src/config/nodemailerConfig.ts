// src/config/nodemailerConfig.ts
import nodemailer from 'nodemailer';
// No necesitas dotenv aquí si ya lo cargas en index.ts
// import dotenv from 'dotenv';
// dotenv.config();

export const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error al conectar con el servidor de correo:', error);
        console.error('Por favor, revisa tus variables de entorno EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS en .env.');
    } else {
        console.log('Servidor de correo listo para enviar mensajes.');
    }
});