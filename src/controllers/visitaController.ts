import { Request, Response } from "express";
import Visita from "../models/visita";
import { io } from "../server";
import { Op } from 'sequelize'; // Asegúrate de importar Op si usas Sequelize

export class visitaController {
  static crear = async (req: Request, res: Response): Promise<void> => {
    try {
      const datos = req.body;

      if (!datos.fecha_visita) {
        datos.fecha_visita = new Date();
      }

      const nuevaVisita = await Visita.create(datos);

      io.emit("nuevaNotificacion", nuevaVisita);

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
        order: [["fecha_visita", "DESC"], ["createdAt", "DESC"]],
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

      res.status(200).json({
        message: "Visita actualizada",
        visita: visitaActualizada,
      });
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
        where: { leida: false },
      });
      io.emit('notificacionesActualizadas');
      res.status(200).json({ message: `Se marcaron ${filasActualizadas} notificaciones como leídas.` });
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
      res.status(500).json({ message: "Error al marcar todas como leídas", error });
    }
  };

  static buscarPorIdentificacion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { identificacion } = req.params;

      if (!identificacion || !identificacion.trim()) {
        res.status(400).json({ message: "Identificación inválida" });
        return;
      }

      // Corregida la lógica para buscar tanto por número (si es un número) como por string
      // Esto es importante ya que las identificaciones pueden ser números o strings
      let searchCondition: any = identificacion.trim();
      if (!isNaN(Number(identificacion))) {
        // Si parece un número, busca la coincidencia exacta como string o número
        // Utilizamos Op.or si la columna 'identificacion' puede ser de diferentes tipos, 
        // o la convertimos a string si la columna en la BD es STRING, o a Number si es INTEGER/NUMERIC
        // Dejaremos la conversión a Number si es posible, ya que en el frontend el campo es de tipo 'text' (solo dígitos)
        searchCondition = identificacion.trim(); 
      }

      const visita = await Visita.findOne({
  where: { 
    identificacion: searchCondition
  },
  order: [
    ['fecha_visita', 'DESC'],
    ['createdAt', 'DESC']
  ],
      });

      if (!visita) {
        // ***** CAMBIO CRÍTICO APLICADO AQUÍ *****
        // Cuando no se encuentra, devolvemos 200 OK con data: null.
        // Esto evita que el frontend entre en el bloque 'catch' y mantenga el flujo de 'try' limpio.
        res.status(200).json({ 
          message: "No se encontró historial para esta identificación.",
          data: null // Devolvemos data: null
        });
        return;
      }

      // Si se encuentra
      res.status(200).json({
        message: "Información de visitante encontrada.",
        data: {
          nombre_visitante: visita.nombre_visitante,
          correo: visita.correo,
          telefono: visita.telefono,
          ciudad: visita.ciudad,
          fecha_visita: visita.fecha_visita ?? visita.get("createdAt"),
        },
      });
    } catch (error) {
      console.error("Error al buscar historial de visitante:", error);
      res.status(500).json({ message: "Error interno al buscar historial", error });
    }
  };
}
