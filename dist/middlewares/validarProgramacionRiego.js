"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarProgramacionRiego = void 0;
const express_validator_1 = require("express-validator");
exports.validarProgramacionRiego = [
    (0, express_validator_1.body)('fecha_inicio')
        .notEmpty().withMessage('La fecha de inicio es obligatoria')
        .isISO8601().withMessage('Formato de fecha inválido (debe ser ISO 8601: YYYY-MM-DDTHH:MM:SSZ)'),
    (0, express_validator_1.body)('fecha_finalizacion')
        .notEmpty().withMessage('La fecha de finalización es obligatoria')
        .isISO8601().withMessage('Formato de fecha inválido (debe ser ISO 8601: YYYY-MM-DDTHH:MM:SSZ)'),
    (0, express_validator_1.body)('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser una cadena de texto'),
    (0, express_validator_1.body)('tipo_riego')
        .notEmpty().withMessage('El tipo de riego es obligatorio')
        .isIn(['goteo', 'aspersión', 'manual']).withMessage('El tipo de riego debe ser: goteo, aspersión o manual'),
    (0, express_validator_1.body)('id_zona')
        .notEmpty().withMessage('El ID de zona es obligatorio')
        .isInt().withMessage('El ID de zona debe ser un número entero'),
];
//# sourceMappingURL=validarProgramacionRiego.js.map