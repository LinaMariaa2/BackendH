"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const Persona_1 = __importDefault(require("../models/Persona"));
const Perfil_1 = __importDefault(require("../models/Perfil"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
const nodemailerConfig_1 = require("../config/nodemailerConfig");
class AuthController {
    static {
        console.log("###################################################");
        console.log("### AuthController.ts: Módulo cargado en memoria ###");
        console.log("###################################################");
    }
    static JWT_SECRET = (() => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("ERROR FATAL: La variable de entorno JWT_SECRET no está definida. Terminando la aplicación.");
            process.exit(1);
        }
        return secret;
    })();
    static JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
    static async sendVerificationCode(user) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.correo,
                subject: 'Código de Verificación de Correo Electrónico para Horti-Tech',
                html: `
                    <p>Hola ${user.nombre_usuario},</p>
                    <p>Gracias por registrarte en nuestra plataforma Horti-Tech.</p>
                    <p>Tu código de verificación es: <strong>${user.verificationCode}</strong></p>
                    <p>Este código expira en 10 minutos. Por favor, úsalo para verificar tu cuenta.</p>
                    <p>Si no solicitaste esto, por favor ignora este correo.</p>
                    <p>Atentamente,<br>El Equipo de Soporte Horti-Tech.</p>`,
            };
            await nodemailerConfig_1.transporter.sendMail(mailOptions);
            console.log(`[AUTH] Código de verificación enviado a ${user.correo}`);
        }
        catch (mailError) {
            console.error('[AUTH] Error al enviar correo de verificación:', mailError);
        }
    }
    static register = async (req, res) => {
        try {
            const { nombre_usuario, correo, contrasena } = req.body;
            const rol = 'operario';
            const existingUser = await Persona_1.default.findOne({ where: { correo } });
            if (existingUser) {
                return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
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
            await Perfil_1.default.create({
                personaId: newUser.id_persona,
                nombre_usuario: newUser.nombre_usuario,
                correo: newUser.correo,
                rol: newUser.rol,
                estado: newUser.estado,
                isVerified: newUser.isVerified,
                foto_url: ''
            });
            await AuthController.sendVerificationCode(newUser);
            res.status(201).json({
                message: 'Registro exitoso. Se ha enviado un código de verificación a tu correo electrónico. Por favor, verifica tu cuenta para iniciar sesión.',
                user: {
                    id: newUser.id_persona,
                    correo: newUser.correo,
                    rol: newUser.rol,
                    isVerified: newUser.isVerified
                }
            });
        }
        catch (error) {
            console.error('[AUTH] Error al registrar usuario:', error);
            res.status(500).json({ error: 'Error interno del servidor al registrar usuario.', details: error.message });
        }
    };
    static login = async (req, res) => {
        try {
            const { correo, contrasena } = req.body;
            const user = await Persona_1.default.findOne({ where: { correo } });
            if (!user) {
                return res.status(401).json({ error: 'Credenciales inválidas.' });
            }
            const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10);
            if (user.estado === 'bloqueado') {
                return res.status(403).json({ error: 'Tu cuenta está bloqueada debido a múltiples intentos fallidos. Inténtalo de nuevo más tarde o contacta al administrador.' });
            }
            if (user.estado === 'inactivo') {
                return res.status(403).json({ error: 'Tu cuenta está inactiva. Contacta al administrador.' });
            }
            if (!user.isVerified) {
                if (!user.verificationCode || (user.verificationCodeExpires && user.verificationCodeExpires < new Date())) {
                    user.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
                    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
                    await user.save();
                    await AuthController.sendVerificationCode(user);
                    return res.status(401).json({ error: 'Correo electrónico no verificado o código expirado. Se ha enviado un nuevo código para que verifiques tu cuenta.' });
                }
                return res.status(401).json({ error: 'Correo electrónico no verificado. Por favor, verifica tu bandeja de entrada con el código existente.' });
            }
            const isMatch = await bcryptjs_1.default.compare(contrasena, user.contrasena);
            if (!isMatch) {
                user.intentos = (user.intentos || 0) + 1;
                if (user.intentos >= MAX_LOGIN_ATTEMPTS) {
                    user.estado = 'bloqueado';
                    await user.save();
                    return res.status(401).json({ error: `Credenciales inválidas. Demasiados intentos fallidos (${user.intentos}/${MAX_LOGIN_ATTEMPTS}). Tu cuenta ha sido bloqueada. Contacta al administrador si persiste.` });
                }
                await user.save();
                return res.status(401).json({ error: `Credenciales inválidas. Intentos restantes: ${MAX_LOGIN_ATTEMPTS - user.intentos}.` });
            }
            user.intentos = 0;
            user.estado = 'activo';
            await user.save();
            // --- CORRECCIÓN AQUÍ: Cambiado 'id' a 'id_persona' para que coincida con authMiddleware ---
            const payload = {
                id_persona: user.id_persona, // ¡CORREGIDO!
                rol: user.rol,
                isVerified: user.isVerified
            };
            // --- FIN DE CORRECCIÓN ---
            const options = {
                expiresIn: AuthController.JWT_EXPIRES_IN
            };
            const token = jsonwebtoken_1.default.sign(payload, AuthController.JWT_SECRET, options);
            const perfil = await Perfil_1.default.findOne({ where: { personaId: user.id_persona } });
            res.status(200).json({
                message: 'Login exitoso',
                token,
                user: {
                    id_persona: user.id_persona, // También es buena práctica unificar este nombre en la respuesta
                    nombre_usuario: user.nombre_usuario,
                    correo: user.correo,
                    rol: user.rol,
                    estado: user.estado,
                    isVerified: user.isVerified,
                    perfil: perfil || null
                }
            });
        }
        catch (error) {
            console.error('[AUTH] Error al iniciar sesión:', error);
            res.status(500).json({ error: 'Error interno del servidor al iniciar sesión.', details: error.message });
        }
    };
    static createPersonaByAdmin = async (req, res) => {
        try {
            const { nombre_usuario, correo, contrasena, rol } = req.body;
            const existingUser = await Persona_1.default.findOne({ where: { correo } });
            if (existingUser) {
                return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
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
            await Perfil_1.default.create({
                personaId: newUser.id_persona,
                nombre_usuario: newUser.nombre_usuario,
                correo: newUser.correo,
                rol: newUser.rol,
                estado: newUser.estado,
                isVerified: newUser.isVerified,
                foto_url: ''
            });
            await AuthController.sendVerificationCode(newUser);
            res.status(201).json({
                message: 'Usuario creado exitosamente por el administrador. Se ha enviado un código de verificación al correo.',
                user: { id: newUser.id_persona, correo: newUser.correo, rol: newUser.rol }
            });
        }
        catch (error) {
            console.error('[AUTH] Error al crear persona por administrador:', error);
            res.status(500).json({ error: 'Error interno del servidor al crear persona.', details: error.message });
        }
    };
    static verifyEmailCode = async (req, res) => {
        try {
            const { correo, verificationCode } = req.body;
            console.log("Intento de verificación para correo:", correo);
            console.log("Código recibido del frontend (raw):", verificationCode);
            const trimmedVerificationCode = verificationCode ? String(verificationCode).trim() : '';
            console.log("Código recibido del frontend (trimmed):", trimmedVerificationCode);
            console.log("Fecha actual del servidor:", new Date().toISOString());
            const user = await Persona_1.default.findOne({
                where: {
                    correo,
                    verificationCode: trimmedVerificationCode,
                    verificationCodeExpires: { [sequelize_1.Op.gt]: new Date() },
                    isVerified: false
                }
            });
            if (!user) {
                const potentialUser = await Persona_1.default.findOne({ where: { correo } });
                if (potentialUser) {
                    console.log("\n--- Detalles del usuario encontrado en DB (sin todas las condiciones): ---");
                    console.log("ID Persona:", potentialUser.id_persona);
                    console.log("Correo DB:", potentialUser.correo);
                    console.log("Código DB:", potentialUser.verificationCode);
                    console.log("Expiración DB:", potentialUser.verificationCodeExpires ? potentialUser.verificationCodeExpires.toISOString() : 'N/A');
                    console.log("isVerified DB:", potentialUser.isVerified);
                    console.log("¿Código recibido ('" + trimmedVerificationCode + "') coincide con DB ('" + potentialUser.verificationCode + "')?", trimmedVerificationCode === potentialUser.verificationCode);
                    console.log("¿Código expirado?", potentialUser.verificationCodeExpires && potentialUser.verificationCodeExpires < new Date());
                    console.log("¿Ya verificado?", potentialUser.isVerified);
                    console.log("-----------------------------------------");
                }
                else {
                    console.log("\n--- No se encontró ningún usuario con ese correo en la base de datos (Error 400). ---");
                    console.log("-----------------------------------------");
                }
                return res.status(400).json({ error: 'Código de verificación inválido, expirado, o correo ya verificado.' });
            }
            user.isVerified = true;
            user.verificationCode = null;
            user.verificationCodeExpires = null;
            await user.save();
            let perfil = await Perfil_1.default.findOne({ where: { personaId: user.id_persona } });
            if (perfil) {
                perfil.isVerified = true;
                await perfil.save();
            }
            else {
                await Perfil_1.default.create({
                    personaId: user.id_persona,
                    nombre_usuario: user.nombre_usuario,
                    correo: user.correo,
                    rol: user.rol,
                    estado: user.estado,
                    isVerified: true,
                    foto_url: ''
                });
            }
            console.log("\n--- Usuario verificado exitosamente. ---");
            res.status(200).json({ message: 'Correo electrónico verificado exitosamente. Ya puedes iniciar sesión.' });
        }
        catch (error) {
            console.error('[AUTH] Error al verificar código:', error);
            res.status(500).json({ error: 'Error interno del servidor al verificar código.', details: error.message });
        }
    };
    static async resendVerificationCode(req, res) {
        try {
            const { correo } = req.body;
            const user = await Persona_1.default.findOne({ where: { correo } });
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado.' });
            }
            if (user.isVerified) {
                return res.status(400).json({ error: 'El correo electrónico ya está verificado.' });
            }
            const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const newVerificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
            user.verificationCode = newVerificationCode;
            user.verificationCodeExpires = newVerificationCodeExpires;
            await user.save();
            await AuthController.sendVerificationCode(user);
            res.status(200).json({ message: 'Nuevo código de verificación enviado al correo.' });
        }
        catch (error) {
            console.error('[AUTH] Error al reenviar código:', error);
            res.status(500).json({ error: 'Error interno del servidor al reenviar código.', details: error.message });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map