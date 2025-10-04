import { Request, Response } from 'express';
import { Op } from 'sequelize';
import ProgramacionRiego from '../models/programacionRiego';
import Zona from '../models/zona';
import HistorialRiego from '../models/historialRiego'; // <-- Importar modelo de historial
import { NotificacionController } from './notificacionController';

export class PrograRiegoController {
  static getTodasLasProgramaciones = async (_req: Request, res: Response): Promise<void> => {
    try {
      const ahora = new Date();
      const datos = await ProgramacionRiego.findAll({
        where: {
          fecha_finalizacion: { [Op.gt]: ahora } // Solo mostrar las que aún no han finalizado
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
      console.log('Body recibido:', req.body);
      const { fecha_inicio, fecha_finalizacion, id_zona, descripcion, tipo_riego } = req.body;
      const inicio = new Date(fecha_inicio);
      const fin = new Date(fecha_finalizacion);
      const ahora = new Date();

      // Validar coherencia de fechas
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

      // Validar solapamiento de programaciones en la misma zona
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
        res.status(409).json({ mensaje: "Ya existe una programación de riego en este rango de tiempo para la misma zona" });
        return;
      }

      // Crear la nueva programación
      const nueva = await ProgramacionRiego.create({ fecha_inicio: inicio, fecha_finalizacion: fin, id_zona, descripcion, tipo_riego });

      // Registrar automáticamente en historial
      const fechaActivacion = new Date(nueva.fecha_inicio);
      const duracionMs = fin.getTime() - inicio.getTime();
      const duracion_minutos = Math.round(duracionMs / 60000);

      await HistorialRiego.create({
        id_pg_riego: nueva.id_pg_riego,
        id_zona: nueva.id_zona,
        fecha_activacion: fechaActivacion,
        duracion_minutos,
      });

      res.status(201).json({ ok: true, mensaje: "Programación de riego creada correctamente", programacion: nueva });
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

      // 🚨 Bloquear solo si ya inició y está activa
      if (inicio <= ahora && programacion.estado === true) {
        res.status(409).json({
          ok: false,
          mensaje: "No se puede actualizar una programación que ya ha iniciado y sigue activa",
        });
        return;
      }

      // Permitir actualizar si no ha iniciado o si está detenida
      await programacion.update(req.body);
      res.json({ ok: true, mensaje: "Programación actualizada correctamente", programacion });
    } catch (error) {
      console.error("❌ Error en actualizarProgramacion:", error);
      res.status(500).json({ ok: false, mensaje: "Error interno al actualizar la programación", detalle: (error as Error).message });
    }
  }

  static async eliminarProgramacion(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ ok: false, mensaje: "ID inválido" });
      return;
    }
    try {
      const programacion = await ProgramacionRiego.findOne({ where: { id_pg_riego: id } });
      if (!programacion) {
        res.status(404).json({ ok: false, mensaje: "Programación no encontrada" });
        return;
      }

      const ahora = new Date();
      const inicio = new Date(programacion.fecha_inicio);

      // Bloquear solo si ya inició y sigue activa
      if (inicio <= ahora && programacion.estado === true) {
        res.status(409).json({ ok: false, mensaje: "No se puede eliminar una programación que ya ha iniciado y sigue activa" });
        return;
      }

      // Eliminar historial relacionado (si existe)
      await HistorialRiego.destroy({ where: { id_pg_riego: id } });

      // Eliminar la programación
      await programacion.destroy();
      res.json({ ok: true, mensaje: "Programación eliminada correctamente" });
    } catch (error) {
      console.error("❌ Error en eliminarProgramacion:", error);
      res.status(500).json({ ok: false, mensaje: "Error interno al eliminar la programación", detalle: (error as Error).message });
    }
  }

  /**
   * Cambiar estado de la programación
   * Aquí agregamos la creación automática de historial si se activa el riego
   */
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

      // Si se activa la programación, crear historial
      if (activo) {
        const fechaActivacion = new Date();
        const duracionMs = new Date(programacion.fecha_finalizacion).getTime() - new Date(programacion.fecha_inicio).getTime();
        const duracion_minutos = Math.round(duracionMs / 60000);
        await NotificacionController.notificarRiego("inicio_riego", programacion.id_zona, programacion.descripcion);

        await HistorialRiego.create({
          id_pg_riego: programacion.id_pg_riego,
          id_zona: programacion.id_zona,
          fecha_activacion: fechaActivacion,
          duracion_minutos,
        });
      }else {
        // Riego finalizado
        await NotificacionController.notificarRiego("fin_riego", programacion.id_zona, programacion.descripcion);
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
          fecha_finalizacion: { [Op.gt]: new Date(), // solo programaciones que no hayan finalizado
          },
          //estado: true, // solo activas (opcional)
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
      res.status(500).json({ error: 'Error al obtener zonas activas de riego', detalle: (error as Error).message || error });
    }
  };

 /**
   * 🔹 Activar riego automático en una zona
   */
  static async activarRiegoAutomatico(id_zona: number) {
    try {
      const ahora = new Date();
      const fin = new Date(ahora.getTime() + 15 * 60000); // por defecto 15 min de riego

      // Crear registro en ProgramacionRiego con estado activo
      const programacion = await ProgramacionRiego.create({
        fecha_inicio: ahora,
        fecha_finalizacion: fin,
        id_zona,
        descripcion: "Riego automático por humedad baja",
        tipo_riego: "goteo", // 👈 puedes ajustarlo según la zona o config
        estado: true,
      });

      // Registrar historial
      await HistorialRiego.create({
        id_pg_riego: programacion.id_pg_riego,
        id_zona: id_zona,
        fecha_activacion: ahora,
        duracion_minutos: 15,
      });

      console.log(`🌱 Riego automático activado en zona ${id_zona}`);
      return programacion;
    } catch (error) {
      console.error("❌ Error en activarRiegoAutomatico:", error);
    }
  }

  /**
   * 🔹 Detener riego automático en una zona
   */
  static async detenerRiegoAutomatico(id_zona: number) {
    try {
      const ahora = new Date();

      // Buscar programaciones activas en esa zona
      const activas = await ProgramacionRiego.findAll({
        where: {
          id_zona,
          estado: true,
          fecha_finalizacion: { [Op.gt]: ahora },
        },
      });

      // Marcarlas como inactivas y ajustar su finalización
      for (const prog of activas) {
        await prog.update({ estado: false, fecha_finalizacion: ahora });
      }

      console.log(`💧 Riego automático detenido en zona ${id_zona}`);
      return activas.length > 0;
    } catch (error) {
      console.error("❌ Error en detenerRiegoAutomatico:", error);
    }
  }


}

 