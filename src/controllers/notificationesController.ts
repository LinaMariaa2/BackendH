import { Request, Response } from 'express';
import TokenPush from '../models/tokenPush';
import Notificaciones from '../models/notificaciones'; // <-- Usa el nombre en plural

export class NotificationController {
  
  // Registra o actualiza el token de un dispositivo
  static async registerToken(req: Request, res: Response) {
    const { id_persona, token, plataforma } = req.body;
    try {
      const [tokenInstance, created] = await TokenPush.findOrCreate({
        where: { token },
        defaults: { id_persona, plataforma, activo: true }
      });

      if (!created) {
        await tokenInstance.update({ id_persona, plataforma, activo: true });
        return res.status(200).json({ mensaje: 'Token actualizado correctamente.' });
      }
      return res.status(201).json({ mensaje: 'Token registrado correctamente.' });
    } catch (error) {
      console.error('Error al registrar token:', error);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  // Obtiene el historial de notificaciones de un usuario
  static async getNotificationsByUser(req: Request, res: Response) {
    const { id_persona } = req.params;
    try {
      const notifications = await Notificaciones.findAll({ // <-- Usa el nombre en plural
        where: { id_persona: id_persona },
        order: [['timestamp_envio', 'DESC']]
      });
      return res.json(notifications);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener notificaciones.' });
    }
  }
}