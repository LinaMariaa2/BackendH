import { Request, Response } from "express";
import Notificacion from "../models/notificacion";
import { io } from "../server"; 

export class NotificacionController {
  // 🔹 Obtener todas las notificaciones
  static async getNotificaciones(req: Request, res: Response): Promise<void> {
    try {
      const notificaciones = await Notificacion.findAll({
        order: [["timestamp", "DESC"]],
      });
      res.status(200).json(notificaciones);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener notificaciones", error });
    }
  }

  // 🔹 Crear nueva notificación
 static async addNotificacion(req: Request, res: Response): Promise<void> {
  try {
    const { tipo, titulo, mensaje } = req.body;

    if (!tipo || !titulo || !mensaje) {
      res.status(400).json({ message: "Faltan campos requeridos" });
      return;
    }

    const notificacion = await Notificacion.create({
      tipo,
      titulo,
      mensaje,
      leida: false,
    });

    // 👇 Convertimos a objeto y le agregamos createdAt
    const notificacionConCreatedAt = {
      ...notificacion.toJSON(),
      createdAt: notificacion.timestamp, // 👈 alias
    };

    // 🔹 Emitir en tiempo real al frontend
    io.emit("nuevaNotificacion", notificacionConCreatedAt);

    res.status(201).json(notificacionConCreatedAt);
  } catch (error) {
    res.status(500).json({ message: "Error al crear notificación", error });
  }
}


  // 🔹 Marcar notificación como leída
  static async marcarLeida(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const notificacion = await Notificacion.findByPk(id);

      if (!notificacion) {
        res.status(404).json({ message: "Notificación no encontrada" });
        return;
      }

      notificacion.leida = true;
      await notificacion.save();

      res.status(200).json({ message: "Notificación marcada como leída", notificacion });
    } catch (error) {
      res.status(500).json({ message: "Error al marcar notificación", error });
    }
  }
}
