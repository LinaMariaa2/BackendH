import { Request, Response } from 'express';
import { Op } from 'sequelize';
import ProgramacionIluminacion from '../models/programacionIluminacion';
import Zona from '../models/zona';
import zonedTimeToUtc from 'assert';
import HistorialIluminacion from '../models/historialIluminacion'

export class ProgramacionIluminacionController {
  static async getAll(req: Request, res: Response) {
    try {
      const programaciones = await ProgramacionIluminacion.findAll();
      res.json(programaciones);
    } catch (error) {
      console.error("Error al obtener programaciones:", error);
      res.status(500).json({ message: "Error al obtener programaciones" });
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

    // 🔹 Registrar automáticamente en historial
    const fechaActivacion = new Date(nueva.fecha_inicio);
    const duracionMs =
      new Date(nueva.fecha_finalizacion).getTime() -
      new Date(nueva.fecha_inicio).getTime();
    const duracion_minutos = Math.round(duracionMs / 60000);

    await HistorialIluminacion.create({
      id_zona: nueva.id_zona,
      id_iluminacion: nueva.id_iluminacion,
      fecha_activacion: fechaActivacion,
      duracion_minutos,
    });

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
    const nuevoEstado = !programacion.estado;
    await programacion.update({ estado: nuevoEstado});

    if (nuevoEstado){
      const fechaActivacion = new Date();
      const duracionMs =
          new Date(programacion.fecha_finalizacion).getTime() -
          new Date(programacion.fecha_inicio).getTime();
        const duracion_minutos = Math.round(duracionMs / 60000);

        await HistorialIluminacion.create({
          id_zona: programacion.id_zona,
          id_iluminacion: programacion.id_iluminacion, // 👈 enlazamos con la programación
          fecha_activacion: fechaActivacion,
          duracion_minutos,
        });

      
      
    }

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


  static async getByZona(req: Request, res: Response) {
    try {
      const { zonaId } = req.params;
      const programaciones = await ProgramacionIluminacion.findAll({
        where: { zonaId },
      });
      res.json(programaciones);
    } catch (error) {
      console.error("Error al obtener programaciones por zona:", error);
      res.status(500).json({ message: "Error al obtener programaciones por zona" });
    }
  }
}
