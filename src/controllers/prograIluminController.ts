import { Request, Response } from 'express';
import { Op } from 'sequelize';
import ProgramacionIluminacion from '../models/programacionIluminacion';
import Zona from '../models/zona';

export class PrograIluminController {
  static getTodasLasProgramaciones = async (_req: Request, res: Response) => {
    try {
      const datos = await ProgramacionIluminacion.findAll();
      res.json(datos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las programaciones', details: error });
    }
  };

  static getProgramacionPorId = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ mensaje: 'ID inválido' });
      return;
    }

    try {
      const dato = await ProgramacionIluminacion.findByPk(id);
      if (dato) {
        res.json(dato);
      } else {
        res.status(404).json({ mensaje: 'Programación no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar la programación', details: error });
    }
  };

  static crearProgramacion = async (req: Request, res: Response) => {
    try {
      const nueva = await ProgramacionIluminacion.create(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la programación', detalle: error });
    }
  };

  static actualizarProgramacion = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ mensaje: 'ID inválido' });
      return;
    }

    try {
      const programacion = await ProgramacionIluminacion.findOne({where:{id_iluminacion: id}});
      if (!programacion) {
        res.status(404).json({ mensaje: 'Programación no encontrada' });
        return;
      }

      await programacion.update(req.body);
      res.json(programacion);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la programación', detalle: error });
    }
  };

  static eliminarProgramacion = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ mensaje: 'ID inválido' });
      return;
    }

    try {
      const eliminado = await ProgramacionIluminacion.destroy({ where: { id_iluminacion: id } });
      if (eliminado) {
        res.json({ mensaje: 'Programación eliminada correctamente' });
      } else {
        res.status(404).json({ mensaje: 'Programación no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la programación', detalle: error });
    }
  };

  //  Cambiar estado (detener/reanudar)
  static cambiarEstadoProgramacion = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  try {
    const programacion = await ProgramacionIluminacion.findOne({ where: { id_iluminacion: id } });

    if (!programacion) {
      return res.status(404).json({ mensaje: 'Programación no encontrada' });
    }

    // Alternar el estado actual
    programacion.estado = !programacion.estado;
    await programacion.save();

    return res.json({
      mensaje: `Programación ${programacion.estado ? 'reanuda' : 'detenida'} correctamente`,
      estado: programacion.estado,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al cambiar el estado de la programación',
      error,
    });
  }
};




static async getProgramacionesFuturasPorZona(req: Request, res: Response) {
  try {
    const zonaId = parseInt(req.params.id);

    const programaciones = await ProgramacionIluminacion.findAll({
      where: {
        id_zona: zonaId,
        fecha_finalizacion: {
          [Op.gt]: new Date(),  // solo programaciones que no hayan finalizado
        },
        //estado: true,           // solo activas (opcional)
      },
      order: [['fecha_inicio', 'ASC']],
    });

    res.json(programaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener programaciones futuras' });
  }
}  


  static getZonasActivasParaESP32 = async (_req: Request, res: Response) => {
    try {
      const ahora = new Date();

      const programaciones = await ProgramacionIluminacion.findAll({
        where: {
          fecha_inicio: { [Op.lte]: ahora },
          fecha_finalizacion: { [Op.gte]: ahora },
          estado: true // solo las activas
        },
        include: [
          {
            model: Zona,
            where: { estado: 'activo' },
            attributes: ['id_zona', 'estado']
          }
        ]
      });

      console.log('🕒 Fecha y hora actual:', ahora.toISOString());
      console.log('📦 Programaciones activas con zona activa:', programaciones.length);
      programaciones.forEach(p => {
        console.log(`🧾 Zona: ${p.id_zona} | Inicio: ${p.fecha_inicio?.toISOString()} | Fin: ${p.fecha_finalizacion?.toISOString()}`);
      });

      const zonasActivadas: Record<string, boolean> = {};
      for (let i = 1; i <= 3; i++) {
        zonasActivadas[i.toString()] = false;
      }

      programaciones.forEach(p => {
        if (p.id_zona && zonasActivadas[p.id_zona.toString()] !== undefined) {
          zonasActivadas[p.id_zona.toString()] = true;
        }
      });

      res.json(zonasActivadas);
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener zonas activas',
        detalle: (error as Error).message || error
      });
    }
  };
}
