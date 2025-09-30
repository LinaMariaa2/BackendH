import { Request, Response } from 'express';
import { Op } from 'sequelize';
import ProgramacionRiego from '../models/programacionRiego';
import Zona from '../models/zona';
import HistorialRiego from '../models/historialRiego';
import { io } from '../server';

export class PrograRiegoController {
  static getTodasLasProgramaciones = async (_req: Request, res: Response): Promise<void> => {
    try {
      const ahora = new Date();
      const datos = await ProgramacionRiego.findAll({
        where: {
          fecha_finalizacion: { [Op.gt]: ahora }
        }
      });
      res.json(datos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las programaciones', detalle: error });
    }
  };

  static getProgramacionPorId = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ mensaje: 'ID inválido' });
      return;
    }

    try {
      const dato = await ProgramacionRiego.findByPk(id);
      if (dato) {
        res.json(dato);
      } else {
        res.status(404).json({ mensaje: 'Programación no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar la programación', detalle: error });
    }
  };

  static crearProgramacion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { fecha_inicio, fecha_finalizacion, id_zona, descripcion, tipo_riego } = req.body;

      const inicio = new Date(fecha_inicio);
      const fin = new Date(fecha_finalizacion);
      const ahora = new Date();

      if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        res.status(400).json({ mensaje: "Fechas inválidas" });
        return;
      }
      if (inicio >= fin) {
        res.status(400).json({ mensaje: "La fecha de inicio debe ser menor a la de finalización" });
        return;
      }
      if (inicio < ahora) {
        res.status(400).json({ mensaje: "No se puede programar en el pasado" });
        return;
      }

      const solapada = await ProgramacionRiego.findOne({
        where: {
          id_zona,
          [Op.or]: [
            { fecha_inicio: { [Op.between]: [inicio, fin] } },
            { fecha_finalizacion: { [Op.between]: [inicio, fin] } },
            {
              [Op.and]: [
                { fecha_inicio: { [Op.lte]: inicio } },
                { fecha_finalizacion: { [Op.gte]: fin } }
              ]
            }
          ]
        }
      });

      if (solapada) {
        res.status(409).json({
          mensaje: "Ya existe una programación de riego en este rango de tiempo para la misma zona"
        });
        return;
      }

      const nueva = await ProgramacionRiego.create({
        fecha_inicio: inicio,
        fecha_finalizacion: fin,
        id_zona,
        descripcion,
        tipo_riego,
        estado: false // <-- aseguramos que inicia como inactiva
      });

      const fechaActivacion = new Date(nueva.fecha_inicio);
      const duracionMs = fin.getTime() - inicio.getTime();
      const duracion_minutos = Math.round(duracionMs / 60000);

      await HistorialRiego.create({
        id_pg_riego: nueva.id_pg_riego,
        id_zona: nueva.id_zona,
        fecha_activacion: fechaActivacion,
        duracion_minutos,
      });

      // 🔔 Notificación al crear programación (compatible con frontend)
      io.emit("nuevaNotificacion", {
        tipo: "riego",
        titulo: "Programación creada",
        mensaje: `📅 Se programó un riego en la zona ${id_zona} para el ${inicio.toLocaleString()}`,
        createdAt: new Date(),
        leida: false
      });

      res.status(201).json({
        ok: true,
        mensaje: "Programación de riego creada correctamente",
        programacion: nueva
      });
    } catch (error) {
      console.error("❌ Error en crearProgramacionRiego:", error);
      res.status(500).json({ ok: false, mensaje: "Error interno al crear la programación", detalle: (error as Error).message });
    }
  };

  static async actualizarProgramacion(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ mensaje: "ID inválido" });
      return;
    }

    try {
      const programacion = await ProgramacionRiego.findOne({
        where: { id_pg_riego: id },
      });

      if (!programacion) {
        res.status(404).json({ mensaje: "Programación no encontrada" });
        return;
      }

      const ahora = new Date();
      const inicio = new Date(programacion.fecha_inicio);

      if (inicio <= ahora && programacion.estado === true) {
        res.status(409).json({
          ok: false,
          mensaje:
            "No se puede actualizar una programación que ya ha iniciado y sigue activa",
        });
        return;
      }

      await programacion.update(req.body);
      res.json({
        ok: true,
        mensaje: "Programación actualizada correctamente",
        programacion,
      });
    } catch (error) {
      console.error("❌ Error en actualizarProgramacion:", error);
      res.status(500).json({
        ok: false,
        mensaje: "Error interno al actualizar la programación",
        detalle: (error as Error).message,
      });
    }
  }

  static async eliminarProgramacion(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ ok: false, mensaje: "ID inválido" });
      return;
    }

    try {
      const programacion = await ProgramacionRiego.findOne({
        where: { id_pg_riego: id },
      });

      if (!programacion) {
        res.status(404).json({ ok: false, mensaje: "Programación no encontrada" });
        return;
      }

      const ahora = new Date();
      const inicio = new Date(programacion.fecha_inicio);

      if (inicio <= ahora && programacion.estado === true) {
        res.status(409).json({
          ok: false,
          mensaje: "No se puede eliminar una programación que ya ha iniciado y sigue activa",
        });
        return;
      }

      await HistorialRiego.destroy({ where: { id_pg_riego: id } });
      await programacion.destroy();

      res.json({
        ok: true,
        mensaje: "Programación eliminada correctamente",
      });
    } catch (error) {
      console.error("❌ Error en eliminarProgramacion:", error);
      res.status(500).json({
        ok: false,
        mensaje: "Error interno al eliminar la programación",
        detalle: (error as Error).message,
      });
    }
  }

  static async cambiarEstadoProgramacion(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ mensaje: 'ID inválido' });
      return;
    }

    const { activo } = req.body;
    if (typeof activo !== 'boolean') {
      res.status(400).json({ mensaje: 'El valor de "activo" debe ser booleano (true o false)' });
      return;
    }

    try {
      const programacion = await ProgramacionRiego.findOne({ where: { id_pg_riego: id } });
      if (!programacion) {
        res.status(404).json({ mensaje: 'Programación no encontrada' });
        return;
      }

      await programacion.update({ estado: activo });

      const fechaEvento = new Date();

      if (activo) {
        const duracionMs = new Date(programacion.fecha_finalizacion).getTime() - new Date(programacion.fecha_inicio).getTime();
        const duracion_minutos = Math.round(duracionMs / 60000);

        await HistorialRiego.create({
          id_pg_riego: programacion.id_pg_riego,
          id_zona: programacion.id_zona,
          fecha_activacion: fechaEvento,
          duracion_minutos,
        });

        // 🔔 Notificación de inicio
        io.emit("nuevaNotificacion", {
          tipo: "riego",
          titulo: "Riego iniciado",
          mensaje: `🌱 Se inició la programación de riego en la zona ${programacion.id_zona}`,
          createdAt: fechaEvento,
          leida: false
        });

      } else {
        // 🔔 Notificación de finalización
        io.emit("nuevaNotificacion", {
          tipo: "riego",
          titulo: "Riego finalizado",
          mensaje: `✅ Finalizó la programación de riego en la zona ${programacion.id_zona}`,
          createdAt: fechaEvento,
          leida: false
        });
      }

      res.json({ mensaje: `Programación ${activo ? 'reanudada' : 'detenida'} correctamente`, estado: activo });
    } catch (error) {
      res.status(500).json({ error: 'Error al cambiar el estado de la programación', detalle: error });
    }
  };

  static async getProgramacionesFuturasPorZonaR(req: Request, res: Response) {
    try {
      const zonaId = parseInt(req.params.id);
      const programaciones = await ProgramacionRiego.findAll({
        where: {
          id_zona: zonaId,
          fecha_finalizacion: {
            [Op.gt]: new Date(),
          },
        },
        order: [['fecha_inicio', 'ASC']],
      });
  
      res.json(programaciones);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener programaciones futuras' });
    }
  }

  static getZonasRiegoActivasParaESP32 = async (_req: Request, res: Response): Promise<void> => {
    try {
      const ahora = new Date();

      const programaciones = await ProgramacionRiego.findAll({
        where: {
          fecha_inicio: { [Op.lte]: ahora },
          fecha_finalizacion: { [Op.gte]: ahora }
        },
        include: [Zona]
      });

      const zonasActivadas: Record<string, string | boolean> = {};
      for (let i = 1; i <= 3; i++) {
        zonasActivadas[i.toString()] = false;
      }

      programaciones.forEach((p) => {
        const zonaId = p.id_zona?.toString();
        let tipo = typeof p.tipo_riego === 'string' ? p.tipo_riego.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : null;

        if (
          zonaId &&
          (tipo === 'goteo' || tipo === 'aspersion') &&
          zonasActivadas[zonaId] !== undefined
        ) {
          zonasActivadas[zonaId] = tipo;
        }
      });

      res.json(zonasActivadas);
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener zonas activas de riego',
        detalle: (error as Error).message || error
      });
    }
  };
}
