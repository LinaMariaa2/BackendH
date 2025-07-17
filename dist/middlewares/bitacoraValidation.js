"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validacionBitacoraBody = exports.validacionIdBitacora = void 0;
const express_validator_1 = require("express-validator");
const invernadero_1 = require("../models/invernadero");
const zona_1 = require("../models/zona");
const Persona_1 = require("../models/Persona");
exports.validacionIdBitacora = [
    (0, express_validator_1.param)('id')
        .isInt({ gt: 0 })
        .withMessage('El ID de publicación debe ser un número positivo'),
];
exports.validacionBitacoraBody = [
    (0, express_validator_1.body)('titulo')
        .notEmpty().withMessage('El título es obligatorio')
        .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),
    (0, express_validator_1.body)('contenido')
        .notEmpty().withMessage('El contenido no puede estar vacío'),
    (0, express_validator_1.body)('importancia')
        .optional()
        .isIn(['alta', 'media', 'baja'])
        .withMessage('La importancia debe ser: alta, media o baja'),
    (0, express_validator_1.body)('tipo_evento')
        .optional()
        .isIn(['riego', 'iluminacion', 'cultivo', 'alerta', 'mantenimiento', 'hardware', 'general'])
        .withMessage('Tipo de evento inválido'),
    (0, express_validator_1.body)('id_invernadero')
        .notEmpty().withMessage('El ID del invernadero es obligatorio')
        .isInt({ gt: 0 }).withMessage('El ID del invernadero debe ser un número positivo')
        .custom(async (id) => {
        const inv = await invernadero_1.Invernadero.findByPk(id);
        if (!inv)
            throw new Error('El invernadero no existe');
        return true;
    }),
    //opcional
    (0, express_validator_1.body)('id_zona')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID de zona debe ser un número positivo')
        .custom(async (id) => {
        const zona = await zona_1.Zona.findByPk(id);
        if (!zona)
            throw new Error('La zona especificada no existe');
        return true;
    }),
    (0, express_validator_1.body)('autor_id')
        .notEmpty().withMessage('El ID del autor es obligatorio')
        .isInt({ gt: 0 }).withMessage('El ID del autor debe ser un número positivo')
        .custom(async (id) => {
        const autor = await Persona_1.Persona.findByPk(id);
        if (!autor)
            throw new Error('El autor no existe');
        return true;
    }),
];
//# sourceMappingURL=bitacoraValidation.js.map