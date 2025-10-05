import { Request, Response } from "express";
import Notificacion from "../models/notificacion";
import { io } from "../server"; 
import { Op } from "sequelize";
import Persona from "../models/Persona"; // Necesario para buscar usuarios y tokens
import { fcm } from "../config/firebaseConfig" // Necesario para enviar notificaciones push
import * as admin from 'firebase-admin'; // Necesario para el tipo MulticastMessage

// --- Objeto para controlar alertas de hardware activas por zona ---
const alertasHardwareActivas: Record<string | number, boolean> = {};

export class NotificacionController {
  // 🔹 Obtener todas las notificaciones
  static async getNotificaciones(req: Request, res: Response): Promise<void> {
    try {
      const notificaciones = await Notificacion.findAll({
        order: [["timestamp", "DESC"]],
      });

      const notifs = notificaciones.map(n => ({
        ...n.toJSON(),
        createdAt: n.timestamp,
      }));

      res.status(200).json(notifs);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener notificaciones", error });
    }
  }

  // 🔹 Crear nueva notificación (IMPLEMENTACIÓN COMPLETA CON PUSH Y LÓGICA DE ALERTA)
  static async addNotificacion(req: Request, res: Response): Promise<void> {
    try {
      const { tipo, titulo, mensaje, id_zona } = req.body;

      if (!tipo || !titulo || !mensaje) {
        res.status(400).json({ message: "Faltan campos requeridos" });
        return;
      }

      // --- Bloquear alertas duplicadas de hardware por zona ---
      if (tipo === "alerta_hardware" && id_zona) {
        if (alertasHardwareActivas[id_zona]) {
          // Ya hay una alerta activa para esta zona
          res.status(200).json({ message: "Alerta de hardware ya activa para esta zona" });
          return;
        }
        alertasHardwareActivas[id_zona] = true;
      }

      const notificacion = await Notificacion.create({
        tipo,
        titulo,
        mensaje,
        leida: false,
        id_zona,
        timestamp: new Date(),
      });

      const notificacionConCreatedAt = {
        ...notificacion.toJSON(),
        createdAt: notificacion.timestamp,
        id_zona: id_zona ?? null,
      };

      let targetRole: 'operario' | 'admin' | null = null;
      // Emitir en tiempo real al frontend
      if (["alerta_sensor", "info_sensor", "inicio_riego", "fin_riego", "iluminacion_inicio", "iluminacion_fin"].includes(tipo)) {
        io.to("operario").emit("nuevaNotificacion", notificacionConCreatedAt);
        targetRole = 'operario';
      } else if (["visita", "alerta_hardware"].includes(tipo)) {
        io.to("admin").emit("nuevaNotificacion", notificacionConCreatedAt);
        targetRole = 'admin';
      }

      // --- Lógica PUSH ---
      if (targetRole) {
        const usersWithToken = await Persona.findAll({ where: { rol: targetRole, fcmToken: { [Op.ne]: null } } });
        const tokens = usersWithToken.map(user => user.fcmToken).filter(Boolean) as string[];

        if (tokens.length > 0) {
            const message: admin.messaging.MulticastMessage = { 
                tokens, 
                notification: { title: titulo, body: mensaje } 
            };
            
            // CORRECCIÓN: Usar sendEachForMulticast
            const response = await fcm.sendEachForMulticast(message); 
            console.log(`🔔 Notificación Push enviada a rol '${targetRole}'. Éxito: ${response.successCount}, Fallo: ${response.failureCount}`);
        }
      }

      res.status(201).json(notificacionConCreatedAt);
    } catch (error) {
      console.error("❌ Error detallado al crear notificación:", JSON.stringify(error, null, 2));
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
      io.emit("notificacionLeida", notificacion.id);

      // --- Liberar alerta hardware si corresponde ---
      // CORRECCIÓN: Usar 'as any' para acceder a id_zona
      if (notificacion.tipo === "alerta_hardware" && (notificacion as any).id_zona) {
        const zona = (notificacion as any).id_zona;
        alertasHardwareActivas[zona] = false;
      }

      res.status(200).json({ message: "Notificación marcada como leída", notificacion });
    } catch (error) {
      res.status(500).json({ message: "Error al marcar notificación", error });
    }
  }

  // 🔹 Marcar todas las notificaciones como leídas
  static async marcarTodasLeidas(req: Request, res: Response): Promise<void> {
    try {
      await Notificacion.update({ leida: true }, { where: { leida: false } });
      io.emit("notificacionesActualizadas");

      // --- Liberar todas las alertas hardware ---
      for (const zona in alertasHardwareActivas) {
        alertasHardwareActivas[zona] = false;
      }

      res.status(200).json({ message: "Todas las notificaciones marcadas como leídas" });
    } catch (error) {
      res.status(500).json({ message: "Error al marcar todas las notificaciones", error });
    }
  }

  // 🔹 Notificaciones para operario
  static async getNotificacionesOperario(req: Request, res: Response): Promise<void> {
    try {
      const notificaciones = await Notificacion.findAll({
        where: { tipo: { [Op.in]: ["alerta_sensor", "info_sensor","inicio_riego","fin_riego", "iluminacion_inicio", "iluminacion_fin"] } },
        order: [["timestamp", "DESC"]],
      });

      const notifs = notificaciones.map(n => ({
        ...n.toJSON(),
        createdAt: n.timestamp,
      }));

      res.status(200).json(notifs);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener notificaciones de operario", error });
    }
  }

  // 🔹 Notificaciones para admin
  static async getNotificacionesAdmin(req: Request, res: Response): Promise<void> {
    try {
      const notificaciones = await Notificacion.findAll({
        where: { tipo: { [Op.in]: ["visita", "alerta_hardware"] } },
        order: [["timestamp", "DESC"]],
      });

      const notifs = notificaciones.map(n => ({
        ...n.toJSON(),
        createdAt: n.timestamp,
      }));

      res.status(200).json(notifs);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener notificaciones de admin", error });
    }
  }

  // 🔹 Notificación de riego (inicio o finalización)
static async notificarRiego(tipo: "inicio_riego" | "fin_riego", id_zona: number, descripcion: string) {
  try {
    const titulo = tipo === "inicio_riego" ? "Riego iniciado" : "Riego finalizado";
    const mensaje = `${descripcion} en zona ${id_zona}`;

    const notificacion = await Notificacion.create({
      tipo: tipo === "inicio_riego" ? "inicio_riego" : "fin_riego",
      titulo,
      mensaje,
      leida: false,
      id_zona, // Asegurar que id_zona se guarde aquí
      timestamp: new Date(),
    });

    const notificacionEmitir = {
      ...notificacion.toJSON(),
      createdAt: notificacion.timestamp,
      id_zona: id_zona,
    };

    io.to("operario").emit("nuevaNotificacion", notificacionEmitir);

    console.log(`🔔 Notificación ${tipo} enviada para zona ${id_zona}`);
  } catch (error) {
    console.error("❌ Error al crear notificación de riego:", error);
  }
}
// 🔹 Notificación de iluminación (inicio o finalización)
static async notificarIluminacion(tipo: "iluminacion_inicio" | "iluminacion_fin", id_zona: number) {
  try {
    const titulo = tipo === "iluminacion_inicio" ? "Iluminación iniciada" : "Iluminación finalizada";
    const mensaje = `${tipo === "iluminacion_inicio" ? "Se ha encendido la iluminación" : "Se ha apagado la iluminación"} en zona ${id_zona}`;

    const notificacion = await Notificacion.create({
      tipo,
      titulo,
      mensaje,
      leida: false,
      timestamp: new Date(),
      id_zona
    });
 
    const notificacionEmitir = {
      ...notificacion.toJSON(),
      createdAt: notificacion.timestamp,
    };

    // Emitir solo al operario (igual que riego)
    io.to("operario").emit("nuevaNotificacion", notificacionEmitir);

    console.log(`🔔 Notificación ${tipo} enviada para zona ${id_zona}`);
  } catch (error) {
    console.error("❌ Error al crear notificación de iluminación:", error);
  }
}
}