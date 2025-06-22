import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import Invernadero from '../models/invernadero';

export const validateInvernaderoId = [
  param('id')
    .isInt({ gt: 0 }).withMessage('El ID debe ser un número entero positivo')
    .toInt()
    .custom(async (value) => {
      const invernadero = await Invernadero.findByPk(value);
      if (!invernadero) {
        throw new Error('El ID no corresponde a un invernadero existente');
      }
    }),
];
// que pertenezaca a un admin activo


export const validateInvernaderoNombreUnico = [
  body('nombre')
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ max: 50 }).withMessage('El nombre no puede tener más de 50 caracteres')
    .custom(async (value, { req }) => {
      const existente = await Invernadero.findOne({ where: { nombre: value } });

      // Si existe y es otro registro (en PUT)
      if (existente && String(existente.id_invernadero) !== String(req.params?.id || '')) {
        throw new Error('Ya existe un invernadero con este nombre');
      }
    }),
];

export const validateInvernaderoBody = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),

  body('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria')
    .isString().withMessage('Debe ser una cadena de texto'),

  body('estado')
    .notEmpty().withMessage('El estado es obligatorio')
    .isIn(['activo', 'inactivo', 'mantenimiento'])
    .withMessage('El estado debe ser "activo", "inactivo" o "mantenimiento"'),

  body('zonas_totales')
    .isInt({ min: 0 }).withMessage('Zonas totales debe ser un número entero positivo'),

  body('zonas_activas')
    .isInt({ min: 0 }).withMessage('Zonas activas debe ser un número entero positivo'),

  body('responsable_id')
    .notEmpty().withMessage('El responsable es obligatorio')
    .isInt({ gt: 0 }).withMessage('El ID del responsable debe ser un número entero positivo'),
];
