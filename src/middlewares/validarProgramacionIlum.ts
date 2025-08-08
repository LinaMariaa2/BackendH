import { body } from 'express-validator';

export const validarProgramacion = [
  body('fecha_inicio')
    .notEmpty().withMessage('La fecha de inicio es obligatoria')
    .isISO8601().withMessage('Formato de fecha inválido (debe incluir fecha y hora ISO)'),

  body('fecha_finalizacion')
    .notEmpty().withMessage('La fecha de finalización es obligatoria')
    .isISO8601().withMessage('Formato de fecha inválido (debe incluir fecha y hora ISO)'),

  body('id_zona')
    .optional() //  esto hace que no sea obligatorio
    .isInt().withMessage('El ID de zona debe ser un número entero'),
];
