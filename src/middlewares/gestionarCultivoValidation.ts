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
    .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),

  body('descripcion')
    .optional()
    .isString().withMessage('La descripción debe ser texto'),

  // Validaciones de temperaturas
  // body('temp_min')
  //   .isFloat({ min: 1, max: 100 }).withMessage('La temperatura mínima debe estar entre 1 y 100'),
  // body('temp_max')
  //   .isFloat({ min: 1, max: 100 }).withMessage('La temperatura máxima debe estar entre 1 y 100')
  //   .custom((value, { req }) => {
  //     if (req.body.temp_min && value < req.body.temp_min) {
  //       throw new Error('La temperatura máxima no puede ser menor que la mínima');
  //     }
  //     return true;
  //   }),

  // // Validaciones de humedades
  // body('humedad_min')
  //   .isFloat({ min: 1, max: 100 }).withMessage('La humedad mínima debe estar entre 1 y 100'),
  // body('humedad_max')
  //   .isFloat({ min: 1, max: 100 }).withMessage('La humedad máxima debe estar entre 1 y 100')
  //   .custom((value, { req }) => {
  //     if (req.body.humedad_min && value < req.body.humedad_min) {
  //       throw new Error('La humedad máxima no puede ser menor que la mínima');
  //     }
  //     return true;
  //   }),

  body('fecha_inicio')
    .notEmpty().withMessage('Fecha de inicio obligatoria')
    .isISO8601().withMessage('Formato de fecha inválido')
    .custom((value) => {
      const [year, month, day] = value.split('-').map(Number); // asumiendo formato "YYYY-MM-DD"
      const fecha = new Date(year, month - 1, day); // crea en hora local sin offset

      const hoy = new Date();
      const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

      if (fecha < hoyLocal) {
        throw new Error('La fecha de inicio no puede ser anterior al día de creación del cultivo');
      }
      return true;
    }),

  body('fecha_fin')
    .optional({ nullable: true })
    .isISO8601().withMessage('Formato de fecha inválido')
    .custom((value, { req }) => {
      if (!req.body.fecha_inicio) return true; // si no hay inicio, ya lo valida el otro campo
      const fechaInicio = new Date(req.body.fecha_inicio);
      const fechaFin = new Date(value);

      if (fechaFin <= fechaInicio) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }
      return true;
    }),

  body('id_zona')
    .optional({ nullable: true })
    .isInt({ gt: 0 }).withMessage('Zona inválida')
    .toInt()
    .custom(async (id) => {
      const zona = await Zona.findByPk(id);
      if (!zona) throw new Error('Zona no encontrada');
    }),
];
