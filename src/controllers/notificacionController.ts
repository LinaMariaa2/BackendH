import { Request, Response } from "express";
import Notificacion from "../models/notificacion";
import { io } from "../server"; 
import { Op } from "sequelize";
import Persona from "../models/Persona";
import { fcm } from "../config/firebaseConfig";
import * as admin from 'firebase-admin';

// Declaración para añadir el objeto 'user' a la Request de Express
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id_persona: number;
    };
  }
}

const alertasHardwareActivas: Record<string | number, boolean> = {};

export class NotificacionController {
    
    static async getNotificaciones(req: Request, res: Response): Promise<void> {
        try {
            const notificaciones = await Notificacion.findAll({ order: [["timestamp", "DESC"]] });
            const notifs = notificaciones.map(n => ({ ...n.toJSON(), createdAt: n.timestamp }));
            res.status(200).json(notifs);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener notificaciones", error });
        }
    }

    static async addNotificacion(req: Request, res: Response): Promise<void> {
        try {
            const { tipo, titulo, mensaje, id_zona } = req.body;

            if (!tipo || !titulo || !mensaje) {
                res.status(400).json({ message: "Faltan campos requeridos" });
                return;
            }

            if (tipo === "alerta_hardware" && id_zona) {
                if (alertasHardwareActivas[id_zona]) {
                    res.status(200).json({ message: "Alerta de hardware ya activa para esta zona" });
                    return;
                }
                alertasHardwareActivas[id_zona] = true;
            }

            // Aquí asumimos que las notificaciones creadas por esta ruta son para roles, no individuos aún
            const notificacion = await Notificacion.create({ tipo, titulo, mensaje, leida: false, id_zona, timestamp: new Date() });
            const notificacionConCreatedAt = { ...notificacion.toJSON(), createdAt: notificacion.timestamp, id_zona: id_zona ?? null };

            let targetRole: 'operario' | 'admin' | null = null;
            if (["alerta_sensor", "info_sensor", "inicio_riego", "fin_riego"].includes(tipo)) {
                io.to("operario").emit("nuevaNotificacion", notificacionConCreatedAt);
                targetRole = 'operario';
            } else if (["visita", "alerta_hardware"].includes(tipo)) {
                io.to("admin").emit("nuevaNotificacion", notificacionConCreatedAt);
                targetRole = 'admin';
            }

            // Lógica PUSH
            if (targetRole) {
                const usersWithToken = await Persona.findAll({ where: { rol: targetRole, fcmToken: { [Op.ne]: null } } });
                const tokens = usersWithToken.map(user => user.fcmToken).filter(Boolean) as string[];

                if (tokens.length > 0) {
                    const message: admin.messaging.MulticastMessage = {
                        tokens,
                        data: { title: titulo, body: mensaje }
                    };
                    await fcm.sendEachForMulticast(message);
                    console.log(`🔔 Notificación Push enviada a rol '${targetRole}'.`);
                }
            }
            res.status(201).json(notificacionConCreatedAt);
        } catch (error) {
            res.status(500).json({ message: "Error al crear notificación", error });
        }
    }

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
            if (notificacion.tipo === "alerta_hardware" && (notificacion as any).id_zona) {
                const zona = (notificacion as any).id_zona;
                alertasHardwareActivas[zona] = false;
            }
            res.status(200).json({ message: "Notificación marcada como leída", notificacion });
        } catch (error) {
            res.status(500).json({ message: "Error al marcar notificación", error });
        }
    }

    static async marcarTodasLeidas(req: Request, res: Response): Promise<void> {
        try {
            await Notificacion.update({ leida: true }, { where: { leida: false } });
            io.emit("notificacionesActualizadas");
            for (const zona in alertasHardwareActivas) {
                alertasHardwareActivas[zona] = false;
            }
            res.status(200).json({ message: "Todas las notificaciones marcadas como leídas" });
        } catch (error) {
            res.status(500).json({ message: "Error al marcar todas las notificaciones", error });
        }
    }

    static async getNotificacionesOperario(req: Request, res: Response): Promise<void> {
        try {
            const notificaciones = await Notificacion.findAll({ where: { tipo: { [Op.in]: ["alerta_sensor", "info_sensor","inicio_riego","fin_riego"] } }, order: [["timestamp", "DESC"]] });
            const notifs = notificaciones.map(n => ({ ...n.toJSON(), createdAt: n.timestamp }));
            res.status(200).json(notifs);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener notificaciones de operario", error });
        }
    }

    static async getNotificacionesAdmin(req: Request, res: Response): Promise<void> {
        try {
            const notificaciones = await Notificacion.findAll({ where: { tipo: { [Op.in]: ["visita", "alerta_hardware"] } }, order: [["timestamp", "DESC"]] });
            const notifs = notificaciones.map(n => ({ ...n.toJSON(), createdAt: n.timestamp }));
            res.status(200).json(notifs);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener notificaciones de admin", error });
        }
    }

    // --- ✨ MÉTODO NUEVO Y SEGURO ---
    static async getMisNotificaciones(req: Request, res: Response): Promise<void> {
        try {
            const personaId = req.user?.id_persona;
            if (!personaId) {
                res.status(401).json({ message: "No autorizado" });
                return;
            }
            const notificaciones = await Notificacion.findAll({
                where: { personaId: personaId },
                order: [["timestamp", "DESC"]],
            });
            res.status(200).json(notificaciones);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener mis notificaciones", error });
        }
    }

    // --- ✨ MÉTODO MEJORADO ---
    static async notificarRiego(tipo: "inicio_riego" | "fin_riego", id_zona: number, descripcion: string) {
        try {
            const titulo = tipo === "inicio_riego" ? "Riego iniciado" : "Riego finalizado";
            const mensaje = `${descripcion} en zona ${id_zona}`;
            
            const operarios = await Persona.findAll({ where: { rol: 'operario' } });

            for (const operario of operarios) {
                await Notificacion.create({
                    tipo, titulo, mensaje, leida: false, timestamp: new Date(),
                    personaId: operario.id_persona
                });
            }
            
            io.to("operario").emit("nuevaNotificacion", { titulo, mensaje, timestamp: new Date() });

            const operariosConToken = operarios.filter(op => op.fcmToken);
            const tokens = operariosConToken.map(op => op.fcmToken) as string[];

            if (tokens.length > 0) {
                const message: admin.messaging.MulticastMessage = {
                    tokens,
                    data: { title: titulo, body: mensaje }
                };
                await fcm.sendEachForMulticast(message);
                console.log(`🔔 Notificación Push de RIEGO enviada a ${tokens.length} operarios.`);
            }
        } catch (error) {
            console.error("❌ Error al crear y enviar notificación de riego:", error);
        }
    }

    // --- ✨ MÉTODO MEJORADO ---
    static async notificarIluminacion(tipo: "iluminacion_inicio" | "iluminacion_fin", id_zona: number) {
        try {
            const titulo = tipo === "iluminacion_inicio" ? "Iluminación iniciada" : "Iluminación finalizada";
            const mensaje = `${tipo === "iluminacion_inicio" ? "Se ha encendido" : "Se ha apagado"} la iluminación en zona ${id_zona}`;

            const operarios = await Persona.findAll({ where: { rol: 'operario' } });

            for (const operario of operarios) {
                await Notificacion.create({
                    tipo, titulo, mensaje, leida: false, timestamp: new Date(), id_zona,
                    personaId: operario.id_persona
                });
            }
            
            io.to("operario").emit("nuevaNotificacion", { titulo, mensaje, timestamp: new Date() });

            const operariosConToken = operarios.filter(op => op.fcmToken);
            const tokens = operariosConToken.map(op => op.fcmToken) as string[];

            if (tokens.length > 0) {
                const message: admin.messaging.MulticastMessage = {
                    tokens,
                    data: { title: titulo, body: mensaje }
                };
                await fcm.sendEachForMulticast(message);
                console.log(`🔔 Notificación Push de ILUMINACIÓN enviada a ${tokens.length} operarios.`);
            }
        } catch (error) {
            console.error("❌ Error al crear y enviar notificación de iluminación:", error);
        }
    }
}