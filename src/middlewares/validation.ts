import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError } from "express-validator";

export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().reduce(
      (acc: Record<string, string>, err: ValidationError) => {
        // Forzamos a string para que TS no se queje
        const field =
          "param" in err
            ? (err.param as string)
            : "path" in err
            ? (err.path as string)
            : "campo_desconocido";

        acc[field] = err.msg;
        return acc;
      },
      {}
    );

    res.status(400).json({ errores: formattedErrors });
    return;
  }

  next();
};
