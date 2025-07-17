"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePersonaId = exports.validatePersonaCorreoUnico = exports.validatePersonaUpdate = exports.validatePersonaCreation = void 0;
const express_validator_1 = require("express-validator");
const Persona_1 = __importDefault(require("../models/Persona"));
// 2. Validación del cuerpo para la creación de una Persona
exports.validatePersonaCreation = [
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
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    (0, express_validator_1.body)('rol')
        .notEmpty().withMessage('El rol es obligatorio')
        .isIn(['admin', 'operario']).withMessage('El rol no es válido. Debe ser "administrador", "instructor" o "aprendiz"'),
    (0, express_validator_1.body)('estado')
        .optional()
        .isIn(['activo', 'inactivo', 'mantenimiento']).withMessage('El estado no es válido. Debe ser "activo", "inactivo" o "bloqueado"'),
    (0, express_validator_1.body)('autenticado')
        .optional()
        .isBoolean().withMessage('El valor de autenticado debe ser un booleano')
        .toBoolean(),
];
// 3. Validación para la actualización de una Persona 
exports.validatePersonaUpdate = [
    (0, express_validator_1.body)('nombre_usuario')
        .optional()
        .trim()
        .notEmpty().withMessage('El nombre de usuario no puede estar vacío')
        .isLength({ min: 3, max: 50 }).withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres'),
    (0, express_validator_1.body)('correo')
        .optional()
        .trim()
        .notEmpty().withMessage('El correo electrónico no puede estar vacío')
        .isEmail().withMessage('El formato del correo electrónico no es válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('rol')
        .optional()
        .notEmpty().withMessage('El rol no puede estar vacío')
        .isIn(['administrador', 'instructor', 'aprendiz']).withMessage('El rol no es válido. Debe ser "administrador", "instructor" o "aprendiz"'),
    (0, express_validator_1.body)('estado')
        .optional()
        .notEmpty().withMessage('El estado no puede estar vacío')
        .isIn(['activo', 'inactivo', 'bloqueado']).withMessage('El estado no es válido. Debe ser "activo", "inactivo" o "bloqueado"'),
    (0, express_validator_1.body)('autenticado')
        .optional()
        .isBoolean().withMessage('El valor de autenticado debe ser un booleano')
        .toBoolean(),
];
// 4. Validación de correo único 
const validatePersonaCorreoUnico = async (req, res, next) => {
    const { correo } = req.body;
    const { id } = req.params;
    if (correo) {
        try {
            const personaExistente = await Persona_1.default.findOne({ where: { correo } });
            if (personaExistente) {
                if (id && personaExistente.id_persona === parseInt(id)) {
                    return next();
                }
                return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
            }
        }
        catch (error) {
            console.error('Error al verificar unicidad del correo:', error);
            return res.status(500).json({ error: 'Error interno al verificar correo', details: error.message });
        }
    }
    next(); // Pasa si el correo es único o si no se envió correo
};
exports.validatePersonaCorreoUnico = validatePersonaCorreoUnico;
exports.validatePersonaId = [
    (0, express_validator_1.param)('id')
        .isInt({ gt: 0 }).withMessage('El ID debe ser un número entero positivo')
        .toInt()
        .custom(async (id) => {
        const persona = await Persona_1.default.findByPk(id);
        if (!persona)
            throw new Error('La persona no existe');
    }),
];
//# sourceMappingURL=personaValidator.js.map