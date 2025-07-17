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
    
      const idZonaActual = req.params?.id_zona || null;

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
      console.log("🧪 Validando invernadero ID:", id); // <--- Nuevo log
      const invernadero = await Invernadero.findByPk(id);
      if (!invernadero) {
        console.log("❌ No existe el invernadero con ID", id);
        throw new Error('El invernadero no existe');
      }

      if (invernadero.estado !== 'activo') {
        console.log("⚠️ Invernadero inactivo");
        throw new Error('El invernadero debe estar activo para asignarle zonas');
      }

      const totalZonas = await Zona.count({ where: { id_invernadero: id } });
      console.log(`📊 El invernadero tiene ${totalZonas} zonas actualmente`);
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
    
  body('id_cultivo')
  .custom((value) => {
    if (value === null || value === undefined) return true; // ✅ permitir null o no enviado
    if (Number.isInteger(value) && value > 0) return true;  // ✅ si es entero positivo
    throw new Error('El ID del cultivo debe ser un número positivo o nulo');
  }),
];

