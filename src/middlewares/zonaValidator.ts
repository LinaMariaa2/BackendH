import { body, param } from 'express-validator';
import Zona from '../models/zona';
import Invernadero from '../models/invernadero';


// middlewares/zonaValidator.ts

export const validateZonaId = [
  param('id_zona')
    .isInt({ gt: 0 })
    .withMessage('El ID debe ser un número entero positivo'),
];


export const validateZonaNombreUnico = [
  body('nombre')
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ max: 100 }).withMessage('El nombre puede tener máximo 100 caracteres')
    .custom(async (value, { req }) => {
      const idZonaActual = req.params?.id || null;
      const idInvernadero = req.body.id_invernadero;
      const zonaExistente = await Zona.findOne({
        where: {
          nombre: value,
          id_invernadero: idInvernadero
        }
      });
      if (zonaExistente && String(zonaExistente.id_zona) !== String(idZonaActual)) {
        throw new Error('Ya existe una zona con este nombre en este invernadero');
      }
    }),
];

export const validateInvernaderoExistente = [
  body('id_invernadero')
    .notEmpty().withMessage('Debes especificar un invernadero')
    .isInt({ gt: 0 }).withMessage('El ID del invernadero debe ser un número positivo')
    .custom(async (id: number) => {
      const invernadero = await Invernadero.findByPk(id);
      if (!invernadero) {
        throw new Error('El invernadero no existe');
      }
      if (invernadero.estado !== 'activo') {
        throw new Error('El invernadero debe estar activo para asignarle zonas');
      }

      const totalZonas = await Zona.count({ where: { id_invernadero: id } });
      if (totalZonas >= 5) {
        throw new Error('El invernadero ya tiene el número máximo de zonas (5)');
      }

      return true;
    })
];


export const validateZonaBody = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('Se permite máximo 100 caracteres'),

  body('descripciones_add')
    .optional()
    .isString().withMessage('La descripción debe ser una cadena de texto'),

  body('estado')
    .notEmpty().withMessage('El estado es obligatorio')
    .isIn(['activo', 'inactivo', 'mantenimiento'])
    .withMessage('El estado debe ser: "activo", "inactivo" o "mantenimiento"'),
];
