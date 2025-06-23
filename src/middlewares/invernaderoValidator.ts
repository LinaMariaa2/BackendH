import { body, param } from 'express-validator';
import Invernadero from '../models/invernadero';
// import Persona from '../models/persona'; 

export const validateInvernaderoId = [
  param('id')
    .isInt({ gt: 0 }).withMessage('El ID debe ser un número entero positivo')
    .toInt()
    .custom(async (id) => {
      const invernadero = await Invernadero.findByPk(id);
      if (!invernadero) throw new Error('El ID no corresponde a un invernadero existente');
    }),
];

export const validateInvernaderoNombreUnico = [
  body('nombre')
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ max: 50 }).withMessage('El nombre puede tener máximo 50 caracteres')
    .custom(async (value, { req }) => {
      const existente = await Invernadero.findOne({ where: { nombre: value } });
      if (existente && String(existente.id_invernadero) !== String(req.params?.id || '')) {
        throw new Error('Ya existe un invernadero con este nombre');
      }
    }),
];

export const validateInvernaderoBody = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 50 }).withMessage('Se dispuso maximo 50 caracteres'),

  body('descripcion')
    .notEmpty().withMessage('La descripción debe ser obligatoria')
    .isString().withMessage('Debe ser una cadena de texto'),

  body('estado')
    .notEmpty().withMessage('El estado es obligatorio')
    .isIn(['activo', 'inactivo', 'mantenimiento'])
    .withMessage('El estado debe ser: "activo", "inactivo" o "mantenimiento"'),
    
  // body('responsable_id')
  //   .notEmpty().withMessage('El responsable es obligatorio')
  //   .isInt({ gt: 0 }).withMessage('Debe ser un número entero positivo')
  //   .custom(async (id) => {
  //     const persona = await Persona.findByPk(id);
  //     if (!persona) throw new Error('El responsable no existe');
  //     if (persona.estado !== 'activo') throw new Error('El responsable debe estar activo');
  //     if (!['admin', 'superadmin'].includes(persona.rol)) {
  //       throw new Error('El responsable debe tener rol de admin o superadmin');
  //     }
  //}),
];
