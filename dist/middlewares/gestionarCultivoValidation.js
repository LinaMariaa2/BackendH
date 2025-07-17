"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCultivoBody = exports.validateCultivoId = void 0;
// middlewares/gestionCultivoValidator.ts
const express_validator_1 = require("express-validator");
const gestionarCultivos_1 = __importDefault(require("../models/gestionarCultivos"));
const zona_1 = __importDefault(require("../models/zona"));
exports.validateCultivoId = [
    (0, express_validator_1.param)('id')
        .isInt({ gt: 0 }).withMessage('ID inválido')
        .toInt()
        .custom(async (id) => {
        const cultivo = await gestionarCultivos_1.default.findByPk(id);
        if (!cultivo)
            throw new Error('Cultivo no encontrado');
    })
];
exports.validateCultivoBody = [
    (0, express_validator_1.body)('nombre_cultivo')
        .notEmpty().withMessage('El nombre del cultivo es obligatorio')
        .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),
    (0, express_validator_1.body)('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser texto'),
    (0, express_validator_1.body)('temp_min').isNumeric().withMessage('Temperatura mínima debe ser numérica'),
    (0, express_validator_1.body)('temp_max').isNumeric().withMessage('Temperatura máxima debe ser numérica'),
    (0, express_validator_1.body)('humedad_min').isNumeric().withMessage('Humedad mínima debe ser numérica'),
    (0, express_validator_1.body)('humedad_max').isNumeric().withMessage('Humedad máxima debe ser numérica'),
    (0, express_validator_1.body)('fecha_inicio')
        .notEmpty().withMessage('Fecha de inicio obligatoria')
        .isISO8601().toDate().withMessage('Formato de fecha inválido'),
    (0, express_validator_1.body)('id_zona')
        .optional({ nullable: true })
        .isInt({ gt: 0 }).toInt()
        .custom(async (id) => {
        const zona = await zona_1.default.findByPk(id);
        if (!zona)
            throw new Error('Zona no encontrada');
    }),
];
//# sourceMappingURL=gestionarCultivoValidation.js.map