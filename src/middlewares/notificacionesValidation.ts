import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Middleware para validar los datos al registrar un token
export const validateTokenRegistration = [
  body('id_persona').isInt({ gt: 0 }).withMessage('El id_persona debe ser un número entero válido.'),
  body('token').isString().notEmpty().withMessage('El token es requerido.'),
  body('plataforma').isIn(['web', 'mobile']).withMessage('La plataforma debe ser "web" o "mobile".'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];