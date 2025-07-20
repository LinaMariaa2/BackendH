import { Request, Response } from 'express';
import { Op } from 'sequelize';
import ProgramacionRiego from '../models/programacionRiego';
import Zona from '../models/zona';

export class PrograRiegoController {
  static getTodasLasProgramaciones = async (_req: Request, res: Response): Promise<void> => {
    try {
      const datos = await ProgramacionRiego.findAll();
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
      const nueva = await ProgramacionRiego.create(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la programación', detalle: error });
    }
  };

  static actualizarProgramacion = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ mensaje: 'ID inválido' });
      return;
    }

    try {
      const programacion = await ProgramacionRiego.findByPk(id);
      if (!programacion) {
        res.status(404).json({ mensaje: 'Programación no encontrada' });
        return;
      }

      await programacion.update(req.body);
      res.json({ mensaje: 'Programación actualizada correctamente', programacion });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la programación', detalle: error });
    }
  };

  static eliminarProgramacion = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ mensaje: 'ID inválido' });
      return;
    }

    try {
      const eliminado = await ProgramacionRiego.destroy({ where: { id_pg_riego: id } });
      if (eliminado) {
        res.json({ mensaje: 'Programación eliminada correctamente' });
      } else {
        res.status(404).json({ mensaje: 'Programación no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la programación', detalle: error });
    }
  };

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
