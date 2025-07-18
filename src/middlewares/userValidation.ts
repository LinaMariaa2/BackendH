// src/middlewares/userValidation.ts
import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Middleware genérico para manejar los errores de validación de express-validator
// Debe ser EXPORTADA
export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

//  Validación para el ID de Persona
export const validatePersonaId = [
    param('id_persona')
        .isInt({ gt: 0 }).withMessage('El ID de persona debe ser un número entero positivo')
        .toInt(),
];

//  Validación para el REGISTRO de un nuevo usuario (pública)
export const validateRegistration = [
    body('nombre_usuario')
        .trim()
        .notEmpty().withMessage('El nombre de usuario es obligatorio')
        .isLength({ min: 3, max: 50 }).withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres'),

    body('correo')
        .trim()
        .notEmpty().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('El formato del correo electrónico no es válido')
        .normalizeEmail(),

    body('contrasena')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.'),

    handleInputErrors
];

//  Validación para la CREACIÓN de una Persona por ADMINISTRADOR
export const validateAdminPersonaCreation = [
    ...validateRegistration.slice(0, -1), // Reutiliza nombre_usuario, correo, contrasena del registro
    body('rol')
        .notEmpty().withMessage('El rol es obligatorio')
        .isIn(['admin', 'aprendiz']).withMessage('El rol no es válido. Debe ser "admin" o "aprendiz"'),
    handleInputErrors
];

//  Validación para la ACTUALIZACIÓN de una Persona (ADMIN)
export const validateAdminPersonaUpdate = [
    body('nombre_usuario')
        .optional()
        .trim()
        .notEmpty().withMessage('El nombre de usuario no puede estar vacío si se proporciona')
        .isLength({ min: 3, max: 50 }).withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres'),

    body('correo')
        .optional()
        .trim()
        .notEmpty().withMessage('El correo electrónico no puede estar vacío si se proporciona')
        .isEmail().withMessage('El formato del correo electrónico no es válido')
        .normalizeEmail(),

    body('contrasena')
        .optional()
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres si se proporciona')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.'),

    body('rol')
        .optional()
        .notEmpty().withMessage('El rol no puede estar vacío si se proporciona')
        .isIn(['admin', 'aprendiz']).withMessage('El rol no es válido. Debe ser "admin" o "aprendiz"'),

    body('estado')
        .optional()
        .notEmpty().withMessage('El estado no puede estar vacío si se proporciona')
        .isIn(['activo', 'inactivo', 'bloqueado']).withMessage('El estado no es válido. Debe ser "activo", "inactivo" o "bloqueado"'),

    body('isVerified')
        .optional()
        .isBoolean().withMessage('El valor de verificación debe ser booleano.')
        .toBoolean(),

    handleInputErrors
];

//  Validación para el Login
export const validateLogin = [
    body('correo')
        .trim()
        .notEmpty().withMessage('El correo electrónico es obligatorio para el login')
        .isEmail().withMessage('El formato del correo electrónico no es válido'),

    body('contrasena')
        .notEmpty().withMessage('La contraseña es obligatoria para el login'),

    handleInputErrors
];

//  Validación para la verificación del código
export const validateVerifyCode = [
    body('correo')
        .trim()
        .notEmpty().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('El formato del correo electrónico no es válido'),
    body('verificationCode')
        .trim()
        .notEmpty().withMessage('El código de verificación es obligatorio')
        .isLength({ min: 6, max: 6 }).withMessage('El código de verificación debe tener 6 caracteres'),
    handleInputErrors
];

// 7. Validación para reenviar el código
// Debe ser EXPORTADA
export const validateResendCode = [
    body('correo')
        .trim()
        .notEmpty().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('El formato del correo electrónico no es válido'),
    handleInputErrors
];
