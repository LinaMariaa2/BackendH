import type { Request, Response } from 'express';
import Zona from '../models/zona';
import { actualizarConteoZonas } from '../helpers/actualizarConteoZona';

export class zonaController {

  static getAll = async (req: Request, res: Response) => {
    try {
      const zonas = await Zona.findAll({
        order: [['id_zona', 'ASC']],
      });
      res.json(zonas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las zonas', details: error });
    }
  };
  static getAllActivos = async (req: Request, res: Response) => {
    try {
      const zona = await Zona.findAll({
        where: { estado: 'activo' },
        order: [['id_zona', 'ASC']],
      });
      res.json(zona);
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener todos las zonas',
        details: error,
      });
  }}

  static getZonasPorInvernadero = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const zonas = await Zona.findAll({
        where: { id_invernadero: id }
      });
      res.json(zonas);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener zonas del invernadero', error });
    }
  }

  static getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const zona = await Zona.findByPk(id);
      if (!zona) {
        res.status(404).json({ error: 'Zona no encontrada' });
        return;
      }
      res.json(zona);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la zona', details: error });
    }
  };

  static crearZona = async (req: Request, res: Response) => {
    try {
      const zona = new Zona(req.body);
      await zona.save();
      await actualizarConteoZonas(zona.id_invernadero);
      res.status(201).json({ mensaje: 'Zona creada correctamente', zona });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la zona', details: error });
    }
  };

  static actualizarZona = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const [updated] = await Zona.update(req.body, {
        where: { id_zona: id },
      });

      if (updated === 0) {
        res.status(404).json({ error: 'Zona no encontrada' });
        return;
      }

      const zonaActualizada = await Zona.findByPk(id);
      if (zonaActualizada) {
        await actualizarConteoZonas(zonaActualizada.id_invernadero);
      }

      res.json({ mensaje: 'Zona actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la zona', details: error });
    }
  };

  static inactivarZona = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const zona = await Zona.findByPk(id);

      if (!zona) {
        res.status(404).json({ error: 'Zona no encontrada' });
        return;
      }

    zona.set('estado', 'inactivo');
    await zona.save({ fields: ['estado'] });
      res.json({ mensaje: 'Zona inactivada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al inactivar la zona', details: error });
    }
  };

  static activarZona = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const zona = await Zona.findByPk(id);

      if (!zona) {
        res.status(404).json({ error: 'Zona no encontrada' });
        return;
      }
      
      zona.set('estado', 'activo');
     await zona.save({ fields: ['estado'] });

      res.json({ mensaje: 'Zona activada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al activar la zona', details: error });
    }
  };

  static mantenimientoZona = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const zona = await Zona.findByPk(id);

      if (!zona) {
        res.status(404).json({ error: 'Zona no encontrada' });
        return;
      }

      zona.set('estado', 'mantenimiento');
      await zona.save({ fields: ['estado'] });

      res.json({ mensaje: 'Zona puesta en mantenimiento correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al cambiar zona a mantenimiento', details: error });
    }
  };
  //organizar la validacion de programaciones asociadas
  static eliminarZona = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const zona = await Zona.findByPk(id);
      if (!zona) {
        res.status(404).json({ error: 'Zona no encontrada' });
        return;
      }
      await zona.destroy();
      res.json({ mensaje: 'Zona eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la zona', details: error });
    }
  };

  
  }
