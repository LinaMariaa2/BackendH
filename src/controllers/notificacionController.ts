import { Request, Response } from "express";

// Base de datos simulada en memoria para las notificaciones
const notificacionesDB: any[] = [];

export class NotificacionController {
  static getNotificaciones = async (req: Request, res: Response): Promise<void> => {
    try {
      // En un entorno real, aquí harías una consulta a tu base de datos
      res.status(200).json(notificacionesDB);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener notificaciones", error });
    }
  };

  static addNotificacion = (notificacion: any) => {
    // Esto simula la adición de una notificación a la "DB"
    notificacionesDB.unshift({
      id: Date.now(),
      titulo: notificacion.titulo,
      mensaje: notificacion.mensaje,
      leida: false,
    });
  };
}
