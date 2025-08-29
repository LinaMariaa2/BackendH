import { NextFunction, Request, Response } from 'express';
import Invernadero from '../models/invernadero';
import { Persona } from '../models/Persona';
import { Op } from 'sequelize';
import { ValidationChain } from 'express-validator';

export class InvernaderoController {
  static getDatosActivos(arg0: string, getDatosActivos: any) {
    throw new Error('Method not implemented.');
  }
  static getId(arg0: string, validateInvernaderoId: ValidationChain[], handleInputErrors: (req: Request, res: Response, next: NextFunction) => void, getId: any) {
    throw new Error('Method not implemented.');
  }
  static getAllActivos(arg0: string, getAllActivos: any) {
    throw new Error('Method not implemented.');
  }
  static getAll(arg0: string, getAll: any) {
    throw new Error('Method not implemented.');
  }

  // Obtener invernaderos por ID de operario (responsable)
  public static async getInvernaderosByOperarioId(req: Request, res: Response): Promise<void> {
    const { idOperario } = req.params;
    try {
      const invernaderos = await Invernadero.findAll({
        where: {
          responsable_id: idOperario,
          estado: {
            [Op.in]: ['activo', 'mantenimiento'],
          },
        },
        include: [{ model: Persona, as: 'encargado', attributes: ['id_persona', 'nombre_usuario'] }],
      });
      if (invernaderos.length === 0) {
        res.status(404).json({ message: 'No se encontraron invernaderos para este operario o no están activos.' });
        return;
      }
      res.status(200).json(invernaderos);
    } catch (error: any) {
      console.error('Error al obtener invernaderos por operario:', error);
      res.status(500).json({ error: 'Error interno del servidor al obtener invernaderos.', details: error.message });
    }
  }

  public static async getAllInvernaderos(req: Request, res: Response): Promise<void> {
    try {
      const invernaderos = await Invernadero.findAll({
        include: [{ model: Persona, as: 'encargado', attributes: ['nombre_usuario'] }]
      });
      res.status(200).json(invernaderos);
    } catch (error: any) {
      console.error('Error al obtener todos los invernaderos:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  public static async createInvernadero(req: Request, res: Response): Promise<void> {
    try {
      const newInvernadero = await Invernadero.create(req.body);
      res.status(201).json(newInvernadero);
    } catch (error: any) {
      console.error('Error al crear invernadero:', error);
      res.status(500).json({ error: 'Error interno del servidor al crear el invernadero.', details: error.message });
    }
  }

  public static async updateInvernadero(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const [updated] = await Invernadero.update(req.body, {
        where: { id_invernadero: id }
      });
      if (updated) {
        const updatedInvernadero = await Invernadero.findOne({ where: { id_invernadero: id } });
        res.status(200).json(updatedInvernadero);
      } else {
        res.status(404).json({ message: 'Invernadero no encontrado.' });
      }
    } catch (error: any) {
      console.error('Error al actualizar invernadero:', error);
      res.status(500).json({ error: 'Error interno del servidor al actualizar el invernadero.', details: error.message });
    }
  }

  public static async deleteInvernadero(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await Invernadero.destroy({
        where: { id_invernadero: id }
      });
      if (deleted) {
        res.status(200).json({ message: 'Invernadero eliminado exitosamente.' });
      } else {
        res.status(404).json({ message: 'Invernadero no encontrado.' });
      }
    } catch (error: any) {
      console.error('Error al eliminar invernadero:', error);
      res.status(500).json({ error: 'Error interno del servidor al eliminar el invernadero.', details: error.message });
    }
  }
}