"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarProgramacion = void 0;
const express_validator_1 = require("express-validator");
exports.validarProgramacion = [
    (0, express_validator_1.body)('fecha_inicio')
        .notEmpty().withMessage('La fecha de inicio es obligatoria')
        .isISO8601().withMessage('Formato de fecha inválido (debe incluir fecha y hora ISO)'),
    (0, express_validator_1.body)('fecha_finalizacion')
        .notEmpty().withMessage('La fecha de finalización es obligatoria')
        .isISO8601().withMessage('Formato de fecha inválido (debe incluir fecha y hora ISO)'),
    (0, express_validator_1.body)('id_zona')
        .notEmpty().withMessage('El ID de zona es obligatorio')
        .isInt().withMessage('El ID de zona debe ser un número entero'),
];
//# sourceMappingURL=validarProgramacionIlum.js.map