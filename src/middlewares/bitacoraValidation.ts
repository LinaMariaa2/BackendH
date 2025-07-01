import { body, param } from 'express-validator';
import { Invernadero } from '../models/invernadero';
import { Zona } from '../models/zona';
import { Persona } from '../models/Persona';


export const validacionIdBitacora = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('El ID de publicación debe ser un número positivo'),
];

export const validacionBitacoraBody = [
  body('titulo')
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),

  body('contenido')
    .notEmpty().withMessage('El contenido no puede estar vacío'),

  body('importancia')
    .optional()
    .isIn(['alta', 'media', 'baja'])
    .withMessage('La importancia debe ser: alta, media o baja'),

  body('tipo_evento')
    .optional()
    .isIn(['riego', 'iluminacion', 'cultivo', 'alerta', 'mantenimiento', 'hardware', 'general'])
    .withMessage('Tipo de evento inválido'),

  body('id_invernadero')
    .notEmpty().withMessage('El ID del invernadero es obligatorio')
    .isInt({ gt: 0 }).withMessage('El ID del invernadero debe ser un número positivo')
    .custom(async (id) => {
      const inv = await Invernadero.findByPk(id);
      if (!inv) throw new Error('El invernadero no existe');
      return true;
    }),
    //opcional
  body('id_zona')
    .optional()
    .isInt({ gt: 0 }).withMessage('El ID de zona debe ser un número positivo')
    .custom(async (id) => {
      const zona = await Zona.findByPk(id);
      if (!zona) throw new Error('La zona especificada no existe');
      return true;
    }),

  body('autor_id')
    .notEmpty().withMessage('El ID del autor es obligatorio')
    .isInt({ gt: 0 }).withMessage('El ID del autor debe ser un número positivo')
    .custom(async (id) => {
      const autor = await Persona.findByPk(id);
      if (!autor) throw new Error('El autor no existe');
      return true;
    }),
];
