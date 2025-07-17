"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const Persona_1 = __importDefault(require("../models/Persona"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
const nodemailerConfig_1 = require("../config/nodemailerConfig");
class AuthController {
    static JWT_SECRET = (() => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("ERROR FATAL: La variable de entorno JWT_SECRET no está definida. Terminando la aplicación.");
            process.exit(1);
        }
        return secret;
    })();
    static JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
    // -ç Enviar Código de Verificación 
    static async sendVerificationCode(user) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER, // Tu correo configurado en .env
                to: user.correo,
                subject: 'Código de Verificación de Correo Electrónico',
                html: `
                    <p>Hola ${user.nombre_usuario},</p>
                    <p>Gracias por registrarte en nuestra plataforma.</p>
                    <p>Tu código de verificación es: <strong>${user.verificationCode}</strong></p>
                    <p>Este código expira en 10 minutos. Por favor, úsalo para verificar tu cuenta.</p>
                    <p>Si no solicitaste esto, por favor ignora este correo.</p>
                    <p>Atentamente, El Equipo de Soporte Horti-Tech.</p>`,
            };
            await nodemailerConfig_1.transporter.sendMail(mailOptions);
            console.log(`Código de verificación enviado a ${user.correo}`);
        }
        catch (mailError) {
            console.error('Error al enviar correo de verificación:', mailError);
        }
    }
    // --- Métodos de Autenticación ---
    // 1. Método para el REGISTRO de usuarios (abierto al público)
    static register = async (req, res) => {
        try {
            const { nombre_usuario, correo, contrasena } = req.body;
            const existingUser = await Persona_1.default.findOne({ where: { correo } });
            if (existingUser) {
                res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
                return;
            }
            const hashedPassword = await bcryptjs_1.default.hash(contrasena, 10);
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
            const newUser = await Persona_1.default.create({
                nombre_usuario,
                correo,
                contrasena: hashedPassword,
                rol: 'operario',
                estado: 'activo',
                isVerified: false,
                verificationCode,
                verificationCodeExpires,
                intentos: 0
            });
            await AuthController.sendVerificationCode(newUser);
            res.status(201).json({
                message: 'Registro exitoso. Se ha enviado un código de verificación a tu correo electrónico. Por favor, verifica tu cuenta para iniciar sesión.',
                user: { id: newUser.id_persona, correo: newUser.correo, rol: newUser.rol, isVerified: newUser.isVerified }
            });
        }
        catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).json({ error: 'Error interno del servidor al registrar usuario.', details: error.message });
        }
    };
    // 2. Método para el LOGIN
    static login = async (req, res) => {
        try {
            const { correo, contrasena } = req.body;
            const user = await Persona_1.default.findOne({ where: { correo } });
            if (!user) {
                res.status(401).json({ error: 'Credenciales inválidas.' });
                return;
            }
            // Parsear MAX_LOGIN_ATTEMPTS de forma segura, con un valor por defecto si no existe
            const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10);
            if (user.estado === 'bloqueado') {
                res.status(403).json({ error: 'Tu cuenta está bloqueada debido a múltiples intentos fallidos. Inténtalo de nuevo más tarde o contacta al administrador.' });
                return;
            }
            if (user.estado === 'inactivo') {
                res.status(403).json({ error: 'Tu cuenta está inactiva. Contacta al administrador.' });
                return;
            }
            if (!user.isVerified) {
                // Si el usuario no está verificado y el código ha expirado o no existe, reenviar uno nuevo
                if (!user.verificationCode || (user.verificationCodeExpires && user.verificationCodeExpires < new Date())) {
                    // Genera un nuevo código si no hay o está expirado
                    user.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
                    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
                    await user.save(); // Guarda el nuevo código y expiración
                    AuthController.sendVerificationCode(user); // Envía el nuevo código
                    res.status(401).json({ error: 'Correo electrónico no verificado o código expirado. Se ha enviado un nuevo código para que verifiques tu cuenta.' });
                    return;
                }
                res.status(401).json({ error: 'Correo electrónico no verificado. Por favor, verifica tu bandeja de entrada con el código existente.' });
                return;
            }
            const isMatch = await bcryptjs_1.default.compare(contrasena, user.contrasena);
            if (!isMatch) {
                user.intentos = (user.intentos || 0) + 1;
                if (user.intentos >= MAX_LOGIN_ATTEMPTS) {
                    user.estado = 'bloqueado'; // Bloquea la cuenta
                    await user.save();
                    res.status(401).json({ error: `Credenciales inválidas. Demasiados intentos fallidos (${user.intentos}/${MAX_LOGIN_ATTEMPTS}). Tu cuenta ha sido bloqueada. Contacta al administrador si persiste.` });
                    return;
                }
                await user.save(); // Guarda el número de intentos actualizado
                res.status(401).json({ error: `Credenciales inválidas. Intentos restantes: ${MAX_LOGIN_ATTEMPTS - user.intentos}.` });
                return;
            }
            // Si las credenciales son correctas, reinicia los intentos y asegura el estado activo
            user.intentos = 0;
            user.estado = 'activo';
            await user.save();
            //  GENERACIÓN DEL TOKEN 
            const payload = {
                id: user.id_persona,
                rol: user.rol,
                isVerified: user.isVerified
            };
            const options = {
                expiresIn: AuthController.JWT_EXPIRES_IN // Utiliza la variable de entorno ya validada
            };
            const token = jsonwebtoken_1.default.sign(payload, AuthController.JWT_SECRET, // Utiliza la variable de entorno ya validada
            options);
            res.status(200).json({
                message: 'Login exitoso',
                token,
                user: {
                    id: user.id_persona,
                    nombre_usuario: user.nombre_usuario,
                    correo: user.correo,
                    rol: user.rol,
                    estado: user.estado,
                    isVerified: user.isVerified
                }
            });
        }
        catch (error) {
            console.error('Error al iniciar sesión:', error);
            res.status(500).json({ error: 'Error interno del servidor al iniciar sesión.', details: error.message });
        }
    };
    // 3. Método para crear una persona (Solo para ADMINISTRADOR)
    static createPersonaByAdmin = async (req, res) => {
        try {
            const { nombre_usuario, correo, contrasena, rol } = req.body;
            const existingUser = await Persona_1.default.findOne({ where: { correo } });
            if (existingUser) {
                res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
                return;
            }
            const hashedPassword = await bcryptjs_1.default.hash(contrasena, 10);
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
            const newUser = await Persona_1.default.create({
                nombre_usuario,
                correo,
                contrasena: hashedPassword,
                rol,
                estado: 'activo',
                isVerified: false,
                verificationCode,
                verificationCodeExpires,
                intentos: 0
            });
            await AuthController.sendVerificationCode(newUser);
            res.status(201).json({
                message: 'Usuario creado exitosamente por el administrador. Se ha enviado un código de verificación al correo.',
                user: { id: newUser.id_persona, correo: newUser.correo, rol: newUser.rol }
            });
        }
        catch (error) {
            console.error('Error al crear persona por administrador:', error);
            res.status(500).json({ error: 'Error interno del servidor al crear persona.', details: error.message });
        }
    };
    //  Método para VERIFICAR el código de verificación de correo
    static verifyEmailCode = async (req, res) => {
        try {
            const { correo, verificationCode } = req.body;
            const user = await Persona_1.default.findOne({
                where: {
                    correo,
                    verificationCode,
                    verificationCodeExpires: { [sequelize_1.Op.gt]: new Date() },
                    isVerified: false
                }
            });
            if (!user) {
                res.status(400).json({ error: 'Código de verificación inválido, expirado, o correo ya verificado.' });
                return;
            }
            // Si el código es válido y no ha expirado, verifica la cuenta
            user.isVerified = true;
            user.verificationCode = null;
            user.verificationCodeExpires = null; // 
            await user.save();
            res.status(200).json({ message: 'Correo electrónico verificado exitosamente. Ya puedes iniciar sesión.' });
        }
        catch (error) {
            console.error('Error al verificar código:', error);
            res.status(500).json({ error: 'Error interno del servidor al verificar código.', details: error.message });
        }
    };
    // 5. Método para REENVIAR el código de verificación
    static async resendVerificationCode(req, res) {
        try {
            const { correo } = req.body;
            const user = await Persona_1.default.findOne({ where: { correo } });
            if (!user) {
                res.status(404).json({ error: 'Usuario no encontrado.' });
                return;
            }
            if (user.isVerified) {
                res.status(400).json({ error: 'El correo electrónico ya está verificado.' });
                return;
            }
            // Genera un nuevo código y fecha de expiración
            const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const newVerificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
            user.verificationCode = newVerificationCode;
            user.verificationCodeExpires = newVerificationCodeExpires;
            await user.save();
            await AuthController.sendVerificationCode(user); // Envía el nuevo código
            res.status(200).json({ message: 'Nuevo código de verificación enviado al correo.' });
        }
        catch (error) {
            console.error('Error al reenviar código:', error);
            res.status(500).json({ error: 'Error interno del servidor al reenviar código.', details: error.message });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map