import { Request, Response } from 'express';
import { Op } from 'sequelize';
import ProgramacionIluminacion from '../models/programacionIluminacion';
import Zona from '../models/zona';
import HistorialIluminacion from '../models/historialIluminacion'
import { NotificacionController } from './notificacionController';


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
    const { fecha_inicio, fecha_finalizacion, id_zona } = req.body;

    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_finalizacion);
    const ahora = new Date();

    // 1. Validar coherencia de fechas
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      res.status(400).json({ mensaje: "Fechas inválidas" });
      return;
    }
    if (inicio >= fin) {
      res.status(400).json({ mensaje: "La fecha de inicio debe ser menor a la finalización" });
      return;
    }
    if (inicio < ahora) {
      res.status(400).json({ mensaje: "No se puede programar en el pasado" });
      return;
    }

    // 2. Validar solapamiento en la misma zona
    const solapada = await ProgramacionIluminacion.findOne({
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
        mensaje: "Ya existe una programación en este rango de tiempo para la misma zona"
      });
      return;
    }

    //  Crear nueva programación
    const nueva = await ProgramacionIluminacion.create(req.body);

    // Registrar automáticamente en historial
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
    console.error("❌ Error en crearProgramacion:", error);
    res.status(500).json({ error: 'Error al crear la programación', detalle: error });
  }
};



static async actualizarProgramacion(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ mensaje: "ID inválido" });
    return;
  }

  try {
    const programacion = await ProgramacionIluminacion.findOne({
      where: { id_iluminacion: id },
    });

    if (!programacion) {
      res.status(404).json({ mensaje: "Programación no encontrada" });
      return;
    }

    const ahora = new Date();
    const inicio = new Date(programacion.fecha_inicio);

    // Bloquear solo si ya inició y está activa
    if (inicio <= ahora && programacion.estado === true) {
      res.status(409).json({
        ok: false,
        mensaje: "No se puede actualizar una programación que ya ha iniciado y sigue activa",
      });
      return;
    }

    // Permitir actualizar si no ha iniciado o si está detenida
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
    res.status(400).json({ mensaje: "ID inválido" });
    return;
  }

  try {
    const programacion = await ProgramacionIluminacion.findOne({
      where: { id_iluminacion: id },
    });

    if (!programacion) {
      res.status(404).json({ mensaje: "Programación no encontrada" });
      return;
    }

    const ahora = new Date();
    const inicio = new Date(programacion.fecha_inicio);

    // Bloquear solo si ya inició y está activa
    if (inicio <= ahora && programacion.estado === true) {
      res.status(409).json({
        ok: false,
        mensaje: "No se puede eliminar una programación que ya ha iniciado y sigue activa",
      });
      return;
    }

    //  Permitir eliminar si no ha iniciado o si está detenida
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

        await NotificacionController.notificarIluminacion("iluminacion_inicio", programacion.id_zona);  
    }else {
      //  Notificación de finalización
      await NotificacionController.notificarIluminacion("iluminacion_fin", programacion.id_zona);
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