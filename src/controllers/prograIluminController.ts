import { Request, Response } from "express";
import ProgramacionIluminacion from "../models/programacionIluminacion";

export class ProgramacionIluminacionController {
  static async getAll(req: Request, res: Response) {
    try {
      const programaciones = await ProgramacionIluminacion.findAll();
      res.json(programaciones);
    } catch (error) {
      console.error("Error al obtener programaciones:", error);
      res.status(500).json({ message: "Error al obtener programaciones" });
    }
  }

  static async getByZona(req: Request, res: Response) {
    try {
      const { zonaId } = req.params;
      const programaciones = await ProgramacionIluminacion.findAll({
        where: { zonaId },
      });
      res.json(programaciones);
    } catch (error) {
      console.error("Error al obtener programaciones por zona:", error);
      res.status(500).json({ message: "Error al obtener programaciones por zona" });
    }
  }
}
