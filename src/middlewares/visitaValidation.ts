// src/middlewares/visitaValidation.ts (REGLAS CORREGIDAS)
import { body } from 'express-validator'; 

export const crearVisitaValidationRules = [
  
  // 1. Validar nombre_visitante (REQUERIDO) - Sin cambios
  body('nombre_visitante')
    .notEmpty().withMessage('El nombre del visitante es obligatorio.')
    .isString().withMessage('El nombre debe ser texto.')
    .isLength({ min: 3, max: 255 }).withMessage('El nombre debe tener entre 3 y 255 caracteres.'),

  // 2. Validar correo (DEJAR OPCIONAL si tu base de datos lo permite) - Sin cambios
  body('correo')
    .trim() 
    .optional({ checkFalsy: true }) 
    .isEmail().withMessage('El formato del correo electrónico es inválido.')
    .isLength({ max: 255 }).withMessage('El correo es demasiado largo.'),
    
    // --- 3. VALIDACIÓN DE IDENTIFICACIÓN (CORREGIDA: REQUERIDA Y CON LONGITUD MÍNIMA) ---
  body('identificacion')
    .trim()
    .notEmpty().withMessage('La identificación es obligatoria.') // Hace que no pueda estar vacía
    .isString().withMessage('La identificación debe ser texto/números.')
    .isLength({ min: 5, max: 15 }).withMessage('La identificación debe tener entre 5 y 15 dígitos.') // AÑADIDO MÍNIMO
    .isNumeric().withMessage('La identificación debe contener solo números.'), // Se asume que es solo numérica

    // --- 4. VALIDACIÓN DE TELÉFONO (CORREGIDA: REQUERIDA Y LONGITUD) ---
  body('telefono')
    .trim()
    .notEmpty().withMessage('El teléfono es obligatorio.') // Ahora es requerido
    .isString().withMessage('El teléfono debe ser texto.')
    .matches(/^\d{7,15}$/).withMessage('Formato de teléfono inválido (solo números, 7-15 dígitos).')
    .isLength({ max: 255 }).withMessage('El teléfono es demasiado largo.'),

  // 5. Validar ciudad y motivo (OPCIONALES)
  body(['ciudad', 'motivo']) // Agrupamos los que quieres mantener como opcionales
    .trim()
    .optional({ checkFalsy: true })
    .isString().withMessage('Este campo debe ser texto.')
    .isLength({ max: 255 }).withMessage('El valor es demasiado largo.'),
    
  // 6. Validar fecha_visita (OPCIONAL y LÓGICA DE NEGOCIO) - Sin cambios
  body('fecha_visita')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('El formato de la fecha es inválido. Use el selector de fecha del navegador.')
    .custom((value) => {
      // Si la fecha existe, validamos que no sea una fecha pasada
      if (value) {
        const fecha = new Date(value);
        if (fecha < new Date()) {
          throw new Error('La fecha de visita no puede ser una fecha u hora pasada.');
        }
      }
      return true;
    }),
];