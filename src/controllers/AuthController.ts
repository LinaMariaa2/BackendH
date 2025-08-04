import { Request, Response } from 'express';
import Persona from '../models/Persona';
import Perfil from '../models/Perfil';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Op } from 'sequelize';
import { transporter } from '../config/nodemailerConfig';

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id_persona: number;
            rol: 'admin' | 'operario';
            isVerified: boolean;
        };
    }
}

export class AuthController {
    private static readonly JWT_SECRET: Secret = (() => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("ERROR FATAL: La variable de entorno JWT_SECRET no está definida. Terminando la aplicación.");
            process.exit(1);
        }
        return secret;
    })();

    private static readonly JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '1h';

    public static async sendVerificationCode(user: Persona) {
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
            await transporter.sendMail(mailOptions);
        } catch (mailError: any) {
            console.error('Error al enviar correo de verificación:', mailError);
        }
    }

    // NUEVO MÉTODO: Enviar código para restablecer contraseña
    static sendPasswordResetCode = async (req: Request, res: Response): Promise<void> => {
        try {
            const { correo } = req.body;
            const user = await Persona.findOne({ where: { correo } });
            
            if (!user) {
                res.status(404).json({ error: 'No existe un usuario con ese correo electrónico.' });
                return;
            }

            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // Expira en 10 minutos
            
            user.verificationCode = verificationCode;
            user.verificationCodeExpires = verificationCodeExpires;
            await user.save();

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.correo,
                subject: 'Código para Restablecer Contraseña en Horti-Tech',
                html: `
                    <p>Hola ${user.nombre_usuario},</p>
                    <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para continuar:</p>
                    <p>Tu código de restablecimiento es: <strong>${user.verificationCode}</strong></p>
                    <p>Este código expira en 10 minutos. Si no solicitaste esto, por favor ignora este correo.</p>
                    <p>Atentamente,<br>El Equipo de Soporte Horti-Tech.</p>`,
            };
            
            await transporter.sendMail(mailOptions);
            
            res.status(200).json({ message: 'Se ha enviado un código de restablecimiento de contraseña a tu correo electrónico.' });

        } catch (error: any) {
            console.error('[AUTH] Error al enviar código de restablecimiento:', error);
            res.status(500).json({ error: 'Error interno del servidor al enviar código de restablecimiento.', details: error.message });
        }
    };
    
    // NUEVO MÉTODO: Verificar código para restablecer contraseña
    static verifyPasswordResetCode = async (req: Request, res: Response): Promise<void> => {
        try {
            const { correo, verificationCode } = req.body;

            const user = await Persona.findOne({
                where: {
                    correo,
                    verificationCode,
                    verificationCodeExpires: { [Op.gt]: new Date() } // El código no debe estar expirado
                }
            });

            if (!user) {
                res.status(400).json({ error: 'El código de verificación es inválido o ha expirado.' });
                return;
            }

            res.status(200).json({ message: 'Código verificado correctamente.' });

        } catch (error: any) {
            console.error('[AUTH] Error al verificar código de restablecimiento:', error);
            res.status(500).json({ error: 'Error interno del servidor al verificar código.', details: error.message });
        }
    };

    // NUEVO MÉTODO: Restablecer la contraseña
    static resetPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, verificationCode, newPassword } = req.body;

            const user = await Persona.findOne({
                where: {
                    correo: email,
                    verificationCode,
                    verificationCodeExpires: { [Op.gt]: new Date() }
                }
            });

            if (!user) {
                res.status(400).json({ error: 'El código de verificación es inválido o ha expirado.' });
                return;
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            
            user.contrasena = hashedPassword;
            user.verificationCode = null;
            user.verificationCodeExpires = null;
            await user.save();

            res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });

        } catch (error: any) {
            console.error('[AUTH] Error al restablecer la contraseña:', error);
            res.status(500).json({ error: 'Error interno del servidor al restablecer la contraseña.', details: error.message });
        }
    };

    static register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { nombre_usuario, correo, contrasena } = req.body;
            const rol = 'operario';

            const allowedRoles = ['operario', 'admin'];
            if (!allowedRoles.includes(rol)) {
                res.status(400).json({ error: 'Rol no válido proporcionado. Solo "operario" o "admin" son permitidos.' });
                return;
            }

            const existingUser = await Persona.findOne({ where: { correo } });
            if (existingUser) {
                res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
                return;
            }

            const hashedPassword = await bcrypt.hash(contrasena, 10);

            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

            const newUser = await Persona.create({
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

            await Perfil.create({
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

        } catch (error: any) {
            console.error('Error al registrar usuario:', error);
            res.status(500).json({ error: 'Error interno del servidor al registrar usuario.', details: error.message });
        }
    };

    static login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { correo, contrasena } = req.body;

            const user = await Persona.findOne({ where: { correo } });
            if (!user) {
                res.status(401).json({ error: 'Credenciales inválidas.' });
                return;
            }

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
                if (!user.verificationCode || (user.verificationCodeExpires && user.verificationCodeExpires < new Date())) {
                    user.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
                    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
                    await user.save();
                    await AuthController.sendVerificationCode(user);
                    res.status(401).json({ error: 'Correo electrónico no verificado o código expirado. Se ha enviado un nuevo código para que verifiques tu cuenta.' });
                    return;
                }
                res.status(401).json({ error: 'Correo electrónico no verificado. Por favor, verifica tu bandeja de entrada con el código existente.' });
                return;
            }

            const isMatch = await bcrypt.compare(contrasena, user.contrasena);
            if (!isMatch) {
                user.intentos = (user.intentos || 0) + 1;
                if (user.intentos >= MAX_LOGIN_ATTEMPTS) {
                    user.estado = 'bloqueado';
                    await user.save();
                    res.status(401).json({ error: `Credenciales inválidas. Demasiados intentos fallidos (${user.intentos}/${MAX_LOGIN_ATTEMPTS}). Tu cuenta ha sido bloqueada. Contacta al administrador si persiste.` });
                    return;
                }
                await user.save();
                res.status(401).json({ error: `Credenciales inválidas. Intentos restantes: ${MAX_LOGIN_ATTEMPTS - user.intentos}.` });
                return;
            }

            user.intentos = 0;
            user.estado = 'activo';
            await user.save();

            const payload = {
                id_persona: user.id_persona,
                rol: user.rol,
                isVerified: user.isVerified
            };

            const options: SignOptions = {
                expiresIn: AuthController.JWT_EXPIRES_IN
            };

            const token = jwt.sign(
                payload,
                AuthController.JWT_SECRET,
                options
            );

            const perfil = await Perfil.findOne({ where: { personaId: user.id_persona } });

            res.status(200).json({
                message: 'Login exitoso',
                token,
                user: {
                    id_persona: user.id_persona,
                    nombre_usuario: user.nombre_usuario,
                    correo: user.correo,
                    rol: user.rol,
                    estado: user.estado,
                    isVerified: user.isVerified,
                    perfil: perfil || null
                }
            });

        } catch (error: any) {
            console.error('[AUTH] Error al iniciar sesión:', error);
            res.status(500).json({ error: 'Error interno del servidor al iniciar sesión.', details: error.message });
        }
    };

    static createPersonaByAdmin = async (req: Request, res: Response): Promise<void> => {
        try {
            const { nombre_usuario, correo, contrasena, rol } = req.body;

            const existingUser = await Persona.findOne({ where: { correo } });
            if (existingUser) {
                res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
                return;
            }

            const hashedPassword = await bcrypt.hash(contrasena, 10);
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

            const newUser = await Persona.create({
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

            await Perfil.create({
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

        } catch (error: any) {
            console.error('[AUTH] Error al crear persona por administrador:', error);
            res.status(500).json({ error: 'Error interno del servidor al crear persona.', details: error.message });
        }
    };

    static verifyEmailCode = async (req: Request, res: Response): Promise<void> => {
        try {
            const { correo, verificationCode } = req.body;

            const trimmedVerificationCode = verificationCode ? String(verificationCode).trim() : '';

            const user = await Persona.findOne({
                where: {
                    correo,
                    verificationCode: trimmedVerificationCode,
                    verificationCodeExpires: { [Op.gt]: new Date() },
                    isVerified: false
                }
            });

            if (!user) {
                res.status(400).json({ error: 'Código de verificación inválido, expirado, o correo ya verificado.' });
                return;
            }

            user.isVerified = true;
            user.verificationCode = null;
            user.verificationCodeExpires = null;
            await user.save();

            let perfil = await Perfil.findOne({ where: { personaId: user.id_persona } });
            if (perfil) {
                perfil.isVerified = true;
                await perfil.save();
            } else {
                await Perfil.create({
                    personaId: user.id_persona,
                    nombre_usuario: user.nombre_usuario,
                    correo: user.correo,
                    rol: user.rol,
                    estado: user.estado,
                    isVerified: true,
                    foto_url: ''
                });
            }

            res.status(200).json({ message: 'Correo electrónico verificado exitosamente. Ya puedes iniciar sesión.' });

        } catch (error: any) {
            console.error('Error al verificar código:', error);
            res.status(500).json({ error: 'Error interno del servidor al verificar código.', details: error.message });
        }
    };

    static async resendVerificationCode(req: Request, res: Response): Promise<void> {
        try {
            const { correo } = req.body;

            const user = await Persona.findOne({ where: { correo } });

            if (!user) {
                res.status(404).json({ error: 'Usuario no encontrado.' });
                return;
            }

            if (user.isVerified) {
                res.status(400).json({ error: 'El correo electrónico ya está verificado.' });
                return;
            }

            const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const newVerificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

            user.verificationCode = newVerificationCode;
            user.verificationCodeExpires = newVerificationCodeExpires;
            await user.save();

            await AuthController.sendVerificationCode(user);

            res.status(200).json({ message: 'Nuevo código de verificación enviado al correo.' });

        } catch (error: any) {
            console.error('[AUTH] Error al reenviar código:', error);
            res.status(500).json({ error: 'Error interno del servidor al reenviar código.', details: error.message });
        }
    }
}