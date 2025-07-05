// src/controllers/AuthController.ts
import { Request, Response } from 'express';
import Persona from '../models/Persona';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Op } from 'sequelize';
import { transporter } from '../config/nodemailerConfig';

export class AuthController {

    // Secreto JWT para firmar y verificar tokens
    private static readonly JWT_SECRET: Secret = (() => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            // Error fatal si la variable de entorno JWT_SECRET no está definida
            console.error("ERROR FATAL: La variable de entorno JWT_SECRET no está definida. Terminando la aplicación.");
            process.exit(1);
        }
        return secret;
    })();

    // Duración de la expiración del token JWT
    private static readonly JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '1h';

    /**
     * @function sendVerificationCode
     * @description Envía un correo electrónico con un código de verificación al usuario.
     * @param {Persona} user - Objeto Persona que contiene los datos del usuario, incluyendo correo y código de verificación.
     */
    public static async sendVerificationCode(user: Persona) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER, // Correo configurado en .env para el envío
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
            await transporter.sendMail(mailOptions);
            console.log(`Código de verificación enviado a ${user.correo}`);
        } catch (mailError: any) {
            console.error('Error al enviar correo de verificación:', mailError);
            // No se lanza el error para no bloquear el flujo principal de registro si falla el envío del correo
        }
    }

    // --- Métodos de Autenticación ---

    /**
     * @function register
     * @description Método para el REGISTRO de nuevos usuarios.
     * Permite a los usuarios registrarse con un nombre de usuario, correo, contraseña y seleccionar un rol.
     * @param {Request} req - Objeto de solicitud de Express.
     * @param {Response} res - Objeto de respuesta de Express.
     * @returns {Promise<void>}
     */
    static register = async (req: Request, res: Response): Promise<void> => {
        try {
            // Desestructuramos los datos del cuerpo de la solicitud, incluyendo el 'rol'
            const { nombre_usuario, correo, contrasena, rol } = req.body;

            // Validar que el rol sea uno de los permitidos para el registro público
            const allowedRoles = ['operario', 'admin'];
            if (!allowedRoles.includes(rol)) {
                res.status(400).json({ error: 'Rol no válido proporcionado. Solo "operario" o "admin" son permitidos.' });
                return;
            }

            // Verificar si ya existe un usuario con el correo electrónico proporcionado
            const existingUser = await Persona.findOne({ where: { correo } });
            if (existingUser) {
                res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
                return;
            }

            // Hashear la contraseña antes de guardarla en la base de datos por seguridad
            const hashedPassword = await bcrypt.hash(contrasena, 10);

            // Generar un código de verificación de 6 dígitos y establecer su expiración (10 minutos)
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

            // Crear el nuevo usuario en la base de datos
            const newUser = await Persona.create({
                nombre_usuario,
                correo,
                contrasena: hashedPassword,
                rol: rol, // Asignamos el rol recibido del frontend (operario o admin)
                estado: 'activo', // Estado inicial del usuario
                isVerified: false, // El usuario no está verificado hasta que use el código
                verificationCode,
                verificationCodeExpires,
                intentos: 0 // Contador de intentos fallidos de login
            });

            // Enviar el código de verificación al correo del nuevo usuario
            await AuthController.sendVerificationCode(newUser);

            // Responder con un mensaje de éxito y datos básicos del usuario creado
            res.status(201).json({
                message: 'Registro exitoso. Se ha enviado un código de verificación a tu correo electrónico. Por favor, verifica tu cuenta para iniciar sesión.',
                user: { id: newUser.id_persona, correo: newUser.correo, rol: newUser.rol, isVerified: newUser.isVerified }
            });

        } catch (error: any) {
            // Manejo de errores internos del servidor durante el registro
            console.error('Error al registrar usuario:', error);
            res.status(500).json({ error: 'Error interno del servidor al registrar usuario.', details: error.message });
        }
    };

    /**
     * @function login
     * @description Método para el LOGIN de usuarios.
     * @param {Request} req - Objeto de solicitud de Express.
     * @param {Response} res - Objeto de respuesta de Express.
     * @returns {Promise<void>}
     */
    static login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { correo, contrasena } = req.body;

            // Buscar al usuario por correo electrónico
            const user = await Persona.findOne({ where: { correo } });
            if (!user) {
                res.status(401).json({ error: 'Credenciales inválidas.' });
                return;
            }

            // Parsear MAX_LOGIN_ATTEMPTS de forma segura, con un valor por defecto si no existe
            const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10);

            // Verificar el estado de la cuenta del usuario
            if (user.estado === 'bloqueado') {
                res.status(403).json({ error: 'Tu cuenta está bloqueada debido a múltiples intentos fallidos. Inténtalo de nuevo más tarde o contacta al administrador.' });
                return;
            }
            if (user.estado === 'inactivo') {
                res.status(403).json({ error: 'Tu cuenta está inactiva. Contacta al administrador.' });
                return;
            }

            // Verificar si el correo electrónico está verificado
            if (!user.isVerified) {
                // Si el usuario no está verificado y el código ha expirado o no existe, reenviar uno nuevo
                if (!user.verificationCode || (user.verificationCodeExpires && user.verificationCodeExpires < new Date())) {
                    user.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
                    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
                    await user.save();
                    AuthController.sendVerificationCode(user);
                    res.status(401).json({ error: 'Correo electrónico no verificado o código expirado. Se ha enviado un nuevo código para que verifiques tu cuenta.' });
                    return;
                }
                res.status(401).json({ error: 'Correo electrónico no verificado. Por favor, verifica tu bandeja de entrada con el código existente.' });
                return;
            }

            // Comparar la contraseña proporcionada con la contraseña hasheada en la base de datos
            const isMatch = await bcrypt.compare(contrasena, user.contrasena);
            if (!isMatch) {
                user.intentos = (user.intentos || 0) + 1;
                if (user.intentos >= MAX_LOGIN_ATTEMPTS) {
                    user.estado = 'bloqueado'; // Bloquea la cuenta si excede los intentos
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

            // Generación del token JWT para el usuario autenticado
            const payload = {
                id: user.id_persona,
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

            // Respuesta exitosa de login con el token y datos del usuario
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

        } catch (error: any) {
            console.error('Error al iniciar sesión:', error);
            res.status(500).json({ error: 'Error interno del servidor al iniciar sesión.', details: error.message });
        }
    };

    /**
     * @function createPersonaByAdmin
     * @description Método para crear una persona (usuario) por un ADMINISTRADOR.
     * Este método es similar a 'register' pero está pensado para ser usado por un administrador
     * para crear nuevas cuentas con roles específicos.
     * @param {Request} req - Objeto de solicitud de Express.
     * @param {Response} res - Objeto de respuesta de Express.
     * @returns {Promise<void>}
     */
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
                rol, // Aquí el rol se toma directamente del body, asumiendo que el admin lo envía
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

        } catch (error: any) {
            console.error('Error al crear persona por administrador:', error);
            res.status(500).json({ error: 'Error interno del servidor al crear persona.', details: error.message });
        }
    };

    /**
     * @function verifyEmailCode
     * @description Método para VERIFICAR el código de verificación de correo electrónico.
     * @param {Request} req - Objeto de solicitud de Express.
     * @param {Response} res - Objeto de respuesta de Express.
     * @returns {Promise<void>}
     */
    static verifyEmailCode = async (req: Request, res: Response): Promise<void> => {
        try {
            const { correo, verificationCode } = req.body;

            // Log de los datos recibidos para depuración
            console.log(`[Verify Code] Intentando verificar correo: ${correo} con código: ${verificationCode}`);

            const user = await Persona.findOne({
                where: {
                    correo,
                    verificationCode,
                    verificationCodeExpires: { [Op.gt]: new Date() }, // Código no expirado
                    isVerified: false // Usuario no verificado aún
                }
            });

            if (!user) {
                // Log detallado si el usuario no se encuentra con esas condiciones
                const existingUserForDebug = await Persona.findOne({ where: { correo } });
                if (existingUserForDebug) {
                    console.warn(`[Verify Code] Usuario encontrado pero no cumple condiciones:`);
                    console.warn(`  Correo: ${existingUserForDebug.correo}`);
                    console.warn(`  isVerified: ${existingUserForDebug.isVerified}`);
                    console.warn(`  Stored Code: ${existingUserForDebug.verificationCode}`);
                    console.warn(`  Expires: ${existingUserForDebug.verificationCodeExpires}`);
                    console.warn(`  Current Time: ${new Date()}`);
                    if (existingUserForDebug.verificationCodeExpires && existingUserForDebug.verificationCodeExpires < new Date()) {
                        console.warn(`  Código expirado para ${existingUserForDebug.correo}`);
                    }
                    if (existingUserForDebug.isVerified) {
                        console.warn(`  Usuario ya verificado: ${existingUserForDebug.correo}`);
                    }
                    if (existingUserForDebug.verificationCode !== verificationCode) {
                        console.warn(`  Código no coincide para ${existingUserForDebug.correo}. Recibido: ${verificationCode}, Esperado: ${existingUserForDebug.verificationCode}`);
                    }
                } else {
                    console.warn(`[Verify Code] Usuario con correo ${correo} no encontrado en la base de datos.`);
                }

                res.status(400).json({ error: 'Código de verificación inválido, expirado, o correo ya verificado.' });
                return;
            }

            // Si el código es válido y no ha expirado, verifica la cuenta
            user.isVerified = true;
            user.verificationCode = null; // Limpiar el código de verificación
            user.verificationCodeExpires = null; // Limpiar la fecha de expiración
            await user.save();

            console.log(`[Verify Code] Correo ${user.correo} verificado exitosamente.`);
            res.status(200).json({ message: 'Correo electrónico verificado exitosamente. Ya puedes iniciar sesión.' });

        } catch (error: any) {
            console.error('Error al verificar código (AuthController):', error);
            res.status(500).json({ error: 'Error interno del servidor al verificar código.', details: error.message });
        }
    };

    /**
     * @function resendVerificationCode
     * @description Método para REENVIAR el código de verificación de correo electrónico.
     * @param {Request} req - Objeto de solicitud de Express.
     * @param {Response} res - Objeto de respuesta de Express.
     * @returns {Promise<void>}
     */
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

            // Genera un nuevo código y fecha de expiración
            const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const newVerificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

            user.verificationCode = newVerificationCode;
            user.verificationCodeExpires = newVerificationCodeExpires;
            await user.save();

            await AuthController.sendVerificationCode(user); // Envía el nuevo código

            res.status(200).json({ message: 'Nuevo código de verificación enviado al correo.' });

        } catch (error: any) {
            console.error('Error al reenviar código:', error);
            res.status(500).json({ error: 'Error interno del servidor al reenviar código.', details: error.message });
        }
    }
}
