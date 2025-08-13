// middlewares/gestionCultivoValidator.ts
import { body, param } from 'express-validator';
import GestionCultivo from '../models/gestionarCultivos';
import Zona from '../models/zona';

export const validateCultivoId = [
  param('id')
    .isInt({ gt: 0 }).withMessage('ID inválido')
    .toInt()
    .custom(async (id) => {
      const cultivo = await GestionCultivo.findByPk(id);
      if (!cultivo) throw new Error('Cultivo no encontrado');
    })
];

export const validateCultivoBody = [
  body('nombre_cultivo')
    .notEmpty().withMessage('El nombre del cultivo es obligatorio')
    .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),

  body('descripcion')
    .optional()
    .isString().withMessage('La descripción debe ser texto'),

  body('temp_min').isNumeric().withMessage('Temperatura mínima debe ser numérica'),
  body('temp_max').isNumeric().withMessage('Temperatura máxima debe ser numérica'),
  body('humedad_min').isNumeric().withMessage('Humedad mínima debe ser numérica'),
  body('humedad_max').isNumeric().withMessage('Humedad máxima debe ser numérica'),

  body('fecha_inicio')
    .notEmpty().withMessage('Fecha de inicio obligatoria')
    .isISO8601().toDate().withMessage('Formato de fecha inválido'),

    body('id_zona')
  .optional({ nullable: true })
  .isInt({ gt: 0 }).toInt()
  .custom(async (id) => {
    const zona = await Zona.findByPk(id);
    if (!zona) throw new Error('Zona no encontrada');
  }),

 

];
