import { Request, Response, NextFunction } from "express";

// Middleware de manejo de errores
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("🔥 Error detectado:", err);

  // Detectar códigos de Postgres
  switch (err.code) {
    case "23503": // Foreign Key Violation
       res.status(400).json({
        error: "No se puede eliminar el invernadero porque tiene registros asociados."
        
      });
      return;

    case "23505": // Unique Violation
       res.status(400).json({
        error: "Ya existe un registro con ese valor único."
      });
      return;

    default:
       res.status(500).json({
        error: "Error interno del servidor."
      });
      return;
  }
}
