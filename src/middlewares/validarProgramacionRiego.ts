import { body } from 'express-validator';

export const validarProgramacionRiego = [
  body('fecha_inicio')
    .notEmpty().withMessage('La fecha de inicio es obligatoria')
    .isISO8601().withMessage('Formato de fecha inválido (debe ser ISO 8601: YYYY-MM-DDTHH:MM:SSZ)'),

  body('fecha_finalizacion')
    .notEmpty().withMessage('La fecha de finalización es obligatoria')
    .isISO8601().withMessage('Formato de fecha inválido (debe ser ISO 8601: YYYY-MM-DDTHH:MM:SSZ)'),

  body('descripcion')
    .optional()
    .isString().withMessage('La descripción debe ser una cadena de texto'),

  body('tipo_riego')
    .notEmpty().withMessage('El tipo de riego es obligatorio')
    .isIn(['goteo', 'aspersión', 'manual']).withMessage('El tipo de riego debe ser: goteo, aspersión o manual'),

  body('id_zona')
    .notEmpty().withMessage('El ID de zona es obligatorio')
    .isInt().withMessage('El ID de zona debe ser un número entero'),
];
