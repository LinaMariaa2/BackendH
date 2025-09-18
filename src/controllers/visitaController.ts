import { Request, Response } from 'express';
import Visita from '../models/visita';

export class visitaController {
  // Obtener todas las visitas
  static getAll = async (_req: Request, res: Response) => {
    try {
      const visitas = await Visita.findAll({
        order: [['fecha_visita', 'ASC']],
      });
      res.json(visitas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las visitas', details: error });
    }
  };

  // Obtener visita por ID
  static getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const visita = await Visita.findByPk(id);
      if (!visita) {
        res.status(404).json({ error: 'Visita no encontrada' });
        return;
      }
      res.json(visita);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la visita', details: error });
    }
  };

  // Crear nueva visita
  static crear = async (req: Request, res: Response) => {
    try {
      const nuevaVisita = await Visita.create(req.body);

      // Si tienes socket.io conectado:
      // req.app.get('io').emit('nueva-visita', nuevaVisita);

      res.status(201).json({ mensaje: 'Visita registrada correctamente', nuevaVisita });
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar la visita', details: error });
    }
  };

  // Actualizar visita
  static actualizar = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const [updated] = await Visita.update(req.body, { where: { id_visita: id } });

      if (updated === 0) {
        res.status(404).json({ error: 'Visita no encontrada' });
        return;
      }

      res.json({ mensaje: 'Visita actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la visita', details: error });
    }
  };

  // Eliminar visita
  static eliminar = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const visita = await Visita.findByPk(id);
      if (!visita) {
        res.status(404).json({ error: 'Visita no encontrada' });
        return;
      }

      await visita.destroy();
      res.json({ mensaje: 'Visita eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la visita', details: error });
    }
  };

  // Cambiar estado (pendiente → aceptada/rechazada)
  static cambiarEstado = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const visita = await Visita.findByPk(id);
      if (!visita) {
        res.status(404).json({ error: 'Visita no encontrada' });
        return;
      }

      visita.estado = estado;
      await visita.save();

      res.json({ mensaje: `Estado de la visita cambiado a ${estado}` });
    } catch (error) {
      res.status(500).json({ error: 'Error al cambiar estado de la visita', details: error });
    }
  };
}
