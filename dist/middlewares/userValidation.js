"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResendCode = exports.validateVerifyCode = exports.validateLogin = exports.validateAdminPersonaUpdate = exports.validateAdminPersonaCreation = exports.validateRegistration = exports.validatePersonaId = exports.handleInputErrors = void 0;
// src/middlewares/userValidation.ts
const express_validator_1 = require("express-validator");
// Middleware genérico para manejar los errores de validación de express-validator
// Debe ser EXPORTADA
const handleInputErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.handleInputErrors = handleInputErrors;
//  Validación para el ID de Persona
exports.validatePersonaId = [
    (0, express_validator_1.param)('id_persona')
        .isInt({ gt: 0 }).withMessage('El ID de persona debe ser un número entero positivo')
        .toInt(),
];
//  Validación para el REGISTRO de un nuevo usuario (pública)
exports.validateRegistration = [
    (0, express_validator_1.body)('nombre_usuario')
        .trim()
        .notEmpty().withMessage('El nombre de usuario es obligatorio')
        .isLength({ min: 3, max: 50 }).withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres'),
    (0, express_validator_1.body)('correo')
        .trim()
        .notEmpty().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('El formato del correo electrónico no es válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('contrasena')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.'),
    exports.handleInputErrors
];
//  Validación para la CREACIÓN de una Persona por ADMINISTRADOR
exports.validateAdminPersonaCreation = [
    ...exports.validateRegistration.slice(0, -1), // Reutiliza nombre_usuario, correo, contrasena del registro
    (0, express_validator_1.body)('rol')
        .notEmpty().withMessage('El rol es obligatorio')
        .isIn(['admin', 'aprendiz']).withMessage('El rol no es válido. Debe ser "admin" o "aprendiz"'),
    exports.handleInputErrors
];
//  Validación para la ACTUALIZACIÓN de una Persona (ADMIN)
exports.validateAdminPersonaUpdate = [
    (0, express_validator_1.body)('nombre_usuario')
        .optional()
        .trim()
        .notEmpty().withMessage('El nombre de usuario no puede estar vacío si se proporciona')
        .isLength({ min: 3, max: 50 }).withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres'),
    (0, express_validator_1.body)('correo')
        .optional()
        .trim()
        .notEmpty().withMessage('El correo electrónico no puede estar vacío si se proporciona')
        .isEmail().withMessage('El formato del correo electrónico no es válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('contrasena')
        .optional()
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres si se proporciona')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.'),
    (0, express_validator_1.body)('rol')
        .optional()
        .notEmpty().withMessage('El rol no puede estar vacío si se proporciona')
        .isIn(['admin', 'aprendiz']).withMessage('El rol no es válido. Debe ser "admin" o "aprendiz"'),
    (0, express_validator_1.body)('estado')
        .optional()
        .notEmpty().withMessage('El estado no puede estar vacío si se proporciona')
        .isIn(['activo', 'inactivo', 'bloqueado']).withMessage('El estado no es válido. Debe ser "activo", "inactivo" o "bloqueado"'),
    (0, express_validator_1.body)('isVerified')
        .optional()
        .isBoolean().withMessage('El valor de verificación debe ser booleano.')
        .toBoolean(),
    exports.handleInputErrors
];
//  Validación para el Login
exports.validateLogin = [
    (0, express_validator_1.body)('correo')
        .trim()
        .notEmpty().withMessage('El correo electrónico es obligatorio para el login')
        .isEmail().withMessage('El formato del correo electrónico no es válido'),
    (0, express_validator_1.body)('contrasena')
        .notEmpty().withMessage('La contraseña es obligatoria para el login'),
    exports.handleInputErrors
];
//  Validación para la verificación del código
exports.validateVerifyCode = [
    (0, express_validator_1.body)('correo')
        .trim()
        .notEmpty().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('El formato del correo electrónico no es válido'),
    (0, express_validator_1.body)('verificationCode')
        .trim()
        .notEmpty().withMessage('El código de verificación es obligatorio')
        .isLength({ min: 6, max: 6 }).withMessage('El código de verificación debe tener 6 caracteres'),
    exports.handleInputErrors
];
// 7. Validación para reenviar el código
// Debe ser EXPORTADA
exports.validateResendCode = [
    (0, express_validator_1.body)('correo')
        .trim()
        .notEmpty().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('El formato del correo electrónico no es válido'),
    exports.handleInputErrors
];
//# sourceMappingURL=userValidation.js.map