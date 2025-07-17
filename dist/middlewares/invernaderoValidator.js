"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInvernaderoBody = exports.validateInvernaderoNombreUnico = exports.validateInvernaderoId = void 0;
const express_validator_1 = require("express-validator");
const invernadero_1 = __importDefault(require("../models/invernadero"));
const Persona_1 = __importDefault(require("../models/Persona"));
exports.validateInvernaderoId = [
    (0, express_validator_1.param)('id')
        .isInt({ gt: 0 }).withMessage('El ID debe ser un número entero positivo')
        .toInt()
        .custom(async (id) => {
        const invernadero = await invernadero_1.default.findByPk(id);
        if (!invernadero)
            throw new Error('El ID no corresponde a un invernadero existente');
    }),
];
exports.validateInvernaderoNombreUnico = [
    (0, express_validator_1.body)('nombre')
        .notEmpty().withMessage('El nombre no puede estar vacío')
        .isLength({ max: 50 }).withMessage('El nombre puede tener máximo 50 caracteres')
        .custom(async (value, { req }) => {
        const existente = await invernadero_1.default.findOne({ where: { nombre: value } });
        if (existente && String(existente.id_invernadero) !== String(req.params?.id || '')) {
            throw new Error('Ya existe un invernadero con este nombre');
        }
    }),
];
exports.validateInvernaderoBody = [
    (0, express_validator_1.body)('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 50 }).withMessage('Se dispuso maximo 50 caracteres'),
    (0, express_validator_1.body)('descripcion')
        .notEmpty().withMessage('La descripción debe ser obligatoria')
        .isString().withMessage('Debe ser una cadena de texto'),
    (0, express_validator_1.body)('estado')
        .notEmpty().withMessage('El estado es obligatorio')
        .isIn(['activo', 'inactivo', 'mantenimiento'])
        .withMessage('El estado debe ser: "activo", "inactivo" o "mantenimiento"'),
    (0, express_validator_1.body)('responsable_id')
        .notEmpty().withMessage('El responsable es obligatorio')
        .isInt({ gt: 0 }).withMessage('Debe ser un número entero positivo')
        .custom(async (id) => {
        const persona = await Persona_1.default.findByPk(id);
        if (!persona)
            throw new Error('El responsable no existe');
        if (persona.estado !== 'activo')
            throw new Error('El responsable debe estar activo');
        if (!['admin', 'superadmin'].includes(persona.rol)) {
            throw new Error('El responsable debe tener rol de admin o superadmin');
        }
    }),
];
//# sourceMappingURL=invernaderoValidator.js.map