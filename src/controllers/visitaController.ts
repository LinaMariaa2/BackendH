import { Request, Response } from "express";
import Visita from "../models/visita";
import { Op } from "sequelize";
import { io } from "../server"; // Asegúrate de que el archivo server.ts exporte 'io'

export class visitaController {
  
  static crear = async (req: Request, res: Response): Promise<void> => {
    try {
      const datos = req.body;
      const nuevaVisita = await Visita.create(datos);
      
      io.emit('nuevaNotificacion', nuevaVisita);

      res.status(201).json({
        message: "Visita creada exitosamente",
        visita: nuevaVisita,
      });
    } catch (error) {
      console.error("Error al crear la visita:", error);
      res.status(500).json({ message: "Error al crear la visita", error });
    }
  };

  static obtenerTodas = async (req: Request, res: Response): Promise<void> => {
    try {
      const visitas = await Visita.findAll({
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json(visitas);
    } catch (error) {
      console.error("Error al obtener las visitas:", error);
      res.status(500).json({ message: "Error al obtener las visitas", error });
    }
  };

  static obtenerPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const visita = await Visita.findByPk(id);
      if (!visita) {
        res.status(404).json({ message: "Visita no encontrada" });
        return;
      }
      res.status(200).json(visita);
    } catch (error) {
      console.error("Error al obtener la visita por ID:", error);
      res.status(500).json({ message: "Error al obtener la visita", error });
    }
  };

  static actualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const datos = req.body;
      const [filasActualizadas, [visitaActualizada]] = await Visita.update(datos, {
        where: { id_visita: id },
        returning: true,
      });
      if (filasActualizadas === 0) {
        res.status(404).json({ message: "Visita no encontrada" });
        return;
      }
      res.status(200).json({ message: "Visita actualizada", visita: visitaActualizada });
    } catch (error) {
      console.error("Error al actualizar la visita:", error);
      res.status(500).json({ message: "Error al actualizar la visita", error });
    }
  };

  static eliminar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const filasEliminadas = await Visita.destroy({
        where: { id_visita: id },
      });
      if (filasEliminadas === 0) {
        res.status(404).json({ message: "Visita no encontrada" });
        return;
      }
      res.status(200).json({ message: "Visita eliminada" });
    } catch (error) {
      console.error("Error al eliminar la visita:", error);
      res.status(500).json({ message: "Error al eliminar la visita", error });
    }
  };

  static marcarComoLeida = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const [filasActualizadas] = await Visita.update({ leida: true }, {
        where: { id_visita: id },
      });
      if (filasActualizadas === 0) {
        res.status(404).json({ message: "Visita no encontrada" });
        return;
      }
      io.emit('visitaActualizada', { id_visita: id, leida: true });
      res.status(200).json({ message: "Notificación marcada como leída" });
    } catch (error) {
      console.error("Error al marcar como leída:", error);
      res.status(500).json({ message: "Error al marcar como leída", error });
    }
  };

  static marcarTodasComoLeidas = async (req: Request, res: Response): Promise<void> => {
    try {
      const [filasActualizadas] = await Visita.update({ leida: true }, {
        where: {
          leida: false,
        },
      });
      io.emit('notificacionesActualizadas');
      res.status(200).json({ message: `Se marcaron ${filasActualizadas} notificaciones como leídas.` });
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
      res.status(500).json({ message: "Error al marcar todas como leídas", error });
    }
  };
}