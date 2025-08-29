import { Request, Response } from "express";
import ProgramacionIluminacion from "../models/programacionIluminacion";
import { Op } from 'sequelize';

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
        where: { id_zona: zonaId }, 
      });
      res.json(programaciones);
    } catch (error) {
      console.error("Error al obtener programaciones por zona:", error);
      res.status(500).json({ message: "Error al obtener programaciones por zona" });
    }
  }

  static async getByZonaFuturas(req: Request, res: Response) {
    try {
      const { zonaId } = req.params;
      const now = new Date();
      const programaciones = await ProgramacionIluminacion.findAll({
        where: {
          id_zona: zonaId,
          fecha_finalizacion: {
            [Op.gte]: now,
          },
        },
      });
      res.json(programaciones);
    } catch (error) {
      console.error("Error al obtener programaciones futuras por zona:", error);
      res.status(500).json({ message: "Error al obtener programaciones futuras por zona" });
    }
  }

  // New method to create a new schedule
  static async crearProgramacion(req: Request, res: Response) {
    try {
      const nuevaProgramacion = await ProgramacionIluminacion.create(req.body);
      res.status(201).json(nuevaProgramacion);
    } catch (error) {
      console.error("Error al crear la programación:", error);
      res.status(500).json({ message: "Error al crear la programación" });
    }
  }


  static async actualizarProgramacion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const [filasActualizadas, programacionActualizada] = await ProgramacionIluminacion.update(req.body, {
        where: { id_iluminacion: id },
        returning: true, 
      });

      if (filasActualizadas > 0) {
        res.json(programacionActualizada[0]);
      } else {
        res.status(404).json({ message: "Programación no encontrada" });
      }
    } catch (error) {
      console.error("Error al actualizar la programación:", error);
      res.status(500).json({ message: "Error al actualizar la programación" });
    }
  }

  // New method to change schedule state
  static async cambiarEstado(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { activo } = req.body;
      const [filasActualizadas] = await ProgramacionIluminacion.update({ estado: activo }, {
        where: { id_iluminacion: id },
      });

      if (filasActualizadas > 0) {
        res.status(200).json({ message: "Estado actualizado exitosamente" });
      } else {
        res.status(404).json({ message: "Programación no encontrada" });
      }
    } catch (error) {
      console.error("Error al cambiar el estado de la programación:", error);
      res.status(500).json({ message: "Error al cambiar el estado de la programación" });
    }
  }
//prohgramacion controller, comentario de ensayo

  static async eliminarProgramacion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const filasEliminadas = await ProgramacionIluminacion.destroy({
        where: { id_iluminacion: id },
      });

      if (filasEliminadas > 0) {
        res.status(200).json({ message: "Programación eliminada exitosamente" });
      } else {
        res.status(404).json({ message: "Programación no encontrada" });
      }
    } catch (error) {
      console.error("Error al eliminar la programación:", error);
      res.status(500).json({ message: "Error al eliminar la programación" });
    }
  }
}
