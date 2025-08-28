import type { Request, Response } from 'express';
import { literal } from 'sequelize';
import Zona from '../models/zona';
import { actualizarConteoZonas } from '../helpers/actualizarConteoZona';
import { Invernadero } from '../models/invernadero';
interface Estadisticas {
  [key: string]: number;
}

export class zonaController {
  static getDatosActivos = async (req: Request, res: Response) => {
    try {
      const zonas = await Zona.findAll({
        where: { estado: 'activo' }, // 👉 Aquí se refiere al estado general de la zona
        attributes: ['id_zona', 'nombre'],
        order: [['id_zona', 'ASC']],
      });
      res.json(zonas);
    } catch (error: any) {
      console.error('Error al obtener las zonas activas:', error);
      res.status(500).json({
        error: 'Error al obtener zonas activas',
        details: error.message,
      });
    }
  };

  static getAll = async (_req: Request, res: Response) => {
    try {
      const zonas = await Zona.findAll({ order: [['id_zona', 'ASC']] });
      res.json(zonas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las zonas', details: error });
    }
  };

  static getAllActivos = async (_req: Request, res: Response) => {
    try {
      const zona = await Zona.findAll({
        where: { estado: 'activo' }, // 👉 Estado general de la zona
        order: [['id_zona', 'ASC']],
      });
      res.json(zona);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener todos las zonas', details: error });
    }
  };

  static getZonasPorInvernadero = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const zonas = await Zona.findAll({ where: { id_invernadero: id } });
      res.json(zonas);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener zonas del invernadero', error });
    }
  };

  static crearZona = async (req: Request, res: Response) => {
    try {
      const { nombre, descripciones_add, estado, id_cultivo, id_invernadero, estado_iluminacion } = req.body;

      const invernadero = await Invernadero.findByPk(id_invernadero);
      if (!invernadero) {
        res.status(404).json({ error: 'Invernadero no encontrado' });
        return;
      }

      if (invernadero.estado !== 'activo') {
        res.status(400).json({
          error: `No se puede crear la zona porque el invernadero está en estado: "${invernadero.estado}".`,
        });
        return;
      }

      const zona = await Zona.create({
        nombre,
        descripciones_add,
        estado,
        estado_iluminacion: estado_iluminacion || 'inactivo',
        id_cultivo: id_cultivo || null,
        id_invernadero,
      });

      await actualizarConteoZonas(zona.id_invernadero);

      res.status(201).json({ mensaje: 'Zona creada correctamente', zona });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la zona', details: error });
    }
  };

  static actualizarZona = async (req: Request, res: Response) => {
    try {
      const { id_zona } = req.params;
      const { nombre, descripciones_add, estado, id_cultivo, id_invernadero, estado_iluminacion } = req.body;

      const [updated] = await Zona.update(
        {
          nombre,
          descripciones_add,
          estado,
          estado_iluminacion: estado_iluminacion || 'inactivo',
          id_cultivo: id_cultivo || null,
          id_invernadero,
        },
        {
          where: { id_zona },
        }
      );

      if (updated === 0) {
        res.status(404).json({ error: 'Zona no encontrada' });
        return;
      }

      const zonaActualizada = await Zona.findByPk(id_zona);
      if (zonaActualizada) {
        await actualizarConteoZonas(zonaActualizada.id_invernadero);
      }

      res.json({ mensaje: 'Zona actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la zona', details: error });
    }
  };

  static cambiarEstadoGenerico = async (req: Request, res: Response) => {
    const { id_zona } = req.params;
    const { estado } = req.body;

    const estadosPermitidos = ['activo', 'inactivo', 'mantenimiento'];
    if (!estadosPermitidos.includes(estado)) {
      res.status(400).json({ error: 'Estado no válido' });
      return;
    }

    const zona = await Zona.findByPk(id_zona);
    if (!zona) {
      res.status(404).json({ error: 'Zona no encontrada' });
      return;
    }

    const invernadero = await Invernadero.findByPk(zona.id_invernadero);
    if (!invernadero) {
      res.status(404).json({ error: 'Invernadero no encontrado' });
      return;
    }

    if (invernadero.estado !== 'activo') {
      res.status(400).json({
        error: `No se puede cambiar el estado de una zona porque su invernadero está en estado: "${invernadero.estado}".`,
      });
      return;
    }

    zona.estado = estado;
    await zona.save({ fields: ['estado'] });

    res.json({ mensaje: 'Estado de la zona actualizado correctamente', zona });
    return;
  };

  static inactivarZona = async (req: Request, res: Response) => {
    try {
      const { id_zona } = req.params;
      const zona = await Zona.findByPk(id_zona);

      if (!zona) {
        res.status(404).json({ error: 'Zona no encontrada' });
        return;
      }

      zona.set('estado', 'inactivo');
      await zona.save({ fields: ['estado'] });
      await actualizarConteoZonas(zona.id_invernadero);

      res.json({ mensaje: 'Zona inactivada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al inactivar la zona', details: error });
    }
  };

  static activarZona = async (req: Request, res: Response) => {
    const { id_zona } = req.params;

    try {
      const zona = await Zona.findByPk(id_zona);
      if (!zona) {
        res.status(404).json({ error: 'Zona no encontrada' });
        return;
      }

      const invernadero = await Invernadero.findByPk(zona.id_invernadero);
      if (!invernadero) {
        res.status(404).json({ error: 'Invernadero no encontrado' });
        return;
      }

      if (invernadero.estado !== 'activo') {
        res.status(400).json({
          error: 'No se puede activar la zona porque el invernadero está inactivo o en mantenimiento',
        });
        return;
      }

      zona.estado = 'activo';
      await zona.save({ fields: ['estado'] });

      res.json({ mensaje: 'Zona activada correctamente', zona });
      return;
    } catch (error) {
      console.error('Error al activar zona:', error);
      res.status(500).json({ error: 'Error al activar zona', details: error });
      return;
    }
  };

  static mantenimientoZona = async (req: Request, res: Response) => {
    try {
      const { id_zona } = req.params;
      const zona = await Zona.findByPk(id_zona);

      if (!zona) {
        res.status(404).json({ error: 'Zona no encontrada' });
        return;
      }

      zona.set('estado', 'mantenimiento');
      await zona.save({ fields: ['estado'] });
      await actualizarConteoZonas(zona.id_invernadero);

      res.json({ mensaje: 'Zona puesta en mantenimiento correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al cambiar zona a mantenimiento', details: error });
    }
  };

  static eliminarZona = async (req: Request, res: Response) => {
    try {
      const { id_zona } = req.params;
      const zona = await Zona.findByPk(id_zona);

      if (!zona) {
        res.status(404).json({ error: 'Zona no encontrada' });
        return;
      }

      const id_invernadero = zona.id_invernadero;
      await zona.destroy();
      await actualizarConteoZonas(id_invernadero);

      res.json({ mensaje: 'Zona eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la zona', details: error });
    }
  };
  
  // 🟢🟢🟢 CÓDIGO CORREGIDO 🟢🟢🟢

 static getEstadisticasZonas = async (_req: Request, res: Response) => {
  try {
    const resultados = await Zona.findAll({
      attributes: ['estado', [literal('COUNT(*)'), 'cantidad']],
      group: ['estado'],
    });

    const estadisticas = resultados.reduce<{ [key: string]: number }>((acc, current) => {
      const estado = current.getDataValue('estado') as string;
      const cantidadRaw = current.getDataValue('cantidad') as unknown;
      const cantidad = Number(cantidadRaw ?? 0);
      acc[estado] = isNaN(cantidad) ? 0 : cantidad;
      return acc;
    }, {});

    res.status(200).json({
      activo: Number(estadisticas.activo) || 0,
      inactivo: Number(estadisticas.inactivo) || 0,
      mantenimiento: Number(estadisticas.mantenimiento) || 0,
    });
  } catch (error: any) {
    console.error('Error al obtener estadísticas de zonas:', error);
    res.status(500).json({
      message: 'Error al obtener estadísticas de zonas',
      details: error?.message || error,
    });
  }
}
};
