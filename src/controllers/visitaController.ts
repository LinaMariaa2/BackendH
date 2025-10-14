import { Request, Response } from "express";
import Visita from "../models/visita";
import { io } from "../server";
import Notificacion from "../models/notificacion";

export class visitaController {
  // --- Crear visita ---
  static crear = async (req: Request, res: Response): Promise<void> => {
    try {
      const datos = req.body;

      if (!datos.fecha_visita) {
        datos.fecha_visita = new Date();
      }

      // Crear la visita en la base de datos
      const nuevaVisita = await Visita.create(datos);

      // Crear la notificación en la base de datos
      await Notificacion.create({
        tipo: "visita",
        titulo: "Nueva visita agendada",
        mensaje: `El usuario ${nuevaVisita.nombre_visitante} agendó una visita para el ${nuevaVisita.fecha_visita}.`,
        leida: false,
        id_visita: nuevaVisita.id_visita, 
      });


       // Convertir a JSON plano y emitir
    const payload = {
      tipo: "visita",
      ...nuevaVisita.toJSON(),
    };

      // Emitir la notificación por Socket.IO
      io.emit("nuevaNotificacion", payload);

      res.status(201).json({
        message: "Visita creada exitosamente",
        visita: nuevaVisita.toJSON(),
      });
    } catch (error) {
      console.error("Error al crear la visita:", error);
      res.status(500).json({ message: "Error al crear la visita", error });
    }
  };

  // --- Obtener todas las visitas ---
  static obtenerTodas = async (req: Request, res: Response): Promise<void> => {
    try {
      const visitas = await Visita.findAll({
        order: [["fecha_visita", "DESC"], ["createdAt", "DESC"]],
      });

      // Convertir a JSON plano para evitar objetos vacíos
      res.status(200).json(visitas.map((v) => v.toJSON()));
    } catch (error) {
      console.error("Error al obtener las visitas:", error);
      res.status(500).json({ message: "Error al obtener las visitas", error });
    }
  };

  // --- Obtener visita por ID ---
  static obtenerPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const visita = await Visita.findByPk(id);
      if (!visita) {
        res.status(404).json({ message: "Visita no encontrada" });
        return;
      }
      res.status(200).json(visita.toJSON());
    } catch (error) {
      console.error("Error al obtener la visita por ID:", error);
      res.status(500).json({ message: "Error al obtener la visita", error });
    }
  };

  // --- Actualizar visita ---
  static actualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const datos = req.body;

      const [filasActualizadas, [visitaActualizada]] = await Visita.update(
        datos,
        {
          where: { id_visita: id },
          returning: true,
        }
      );

      if (filasActualizadas === 0) {
        res.status(404).json({ message: "Visita no encontrada" });
        return;
      }

      res.status(200).json({
        message: "Visita actualizada",
        visita: visitaActualizada.toJSON(),
      });
    } catch (error) {
      console.error("Error al actualizar la visita:", error);
      res.status(500).json({ message: "Error al actualizar la visita", error });
    }
  };

  // --- Eliminar visita ---
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

  // --- Marcar visita como leída ---
  static marcarComoLeida = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const [filasActualizadas] = await Visita.update(
        { leida: true },
        { where: { id_visita: id } }
      );

      if (filasActualizadas === 0) {
        res.status(404).json({ message: "Visita no encontrada" });
        return;
      }

      io.emit("visitaActualizada", { id, leida: true });

      res.status(200).json({ message: "Notificación marcada como leída" });
    } catch (error) {
      console.error("Error al marcar como leída:", error);
      res.status(500).json({ message: "Error al marcar como leída", error });
    }
  };

  // --- Marcar todas como leídas ---
  static marcarTodasComoLeidas = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const [filasActualizadas] = await Visita.update(
        { leida: true },
        { where: { leida: false } }
      );

      io.emit("notificacionesActualizadas");

      res
        .status(200)
        .json({
          message: `Se marcaron ${filasActualizadas} notificaciones como leídas.`,
        });
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
      res.status(500).json({ message: "Error al marcar todas como leídas", error });
    }
  };

  // --- Buscar por identificación ---
  static buscarPorIdentificacion = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { identificacion } = req.params;

      if (!identificacion || !identificacion.trim()) {
        res.status(400).json({ message: "Identificación inválida" });
        return;
      }

      const visita = await Visita.findOne({
        where: { identificacion: identificacion.trim() },
        order: [
          ["fecha_visita", "DESC"],
          ["createdAt", "DESC"],
        ],
      });

      if (!visita) {
        res.status(200).json({
          message: "No se encontró historial para esta identificación.",
          data: null,
        });
        return;
      }

      res.status(200).json({
        message: "Información de visitante encontrada.",
        data: {
          id: visita.id_visita,
          nombre_visitante: visita.nombre_visitante,
          correo: visita.correo,
          telefono: visita.telefono,
          ciudad: visita.ciudad,
          fecha_visita: visita.fecha_visita ?? visita.get("createdAt"),
        },
      });
    } catch (error) {
      console.error("Error al buscar historial de visitante:", error);
      res.status(500).json({
        message: "Error interno al buscar historial",
        error,
      });
    }
  };
}
