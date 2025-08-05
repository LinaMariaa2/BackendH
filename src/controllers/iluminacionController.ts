import type { Request, Response } from 'express';
import Invernadero from '../models/invernadero';
import Zona from '../models/zona';

export class iluminacionController {
  
  static getInvernaderosActivos = async (req: Request, res: Response) => {
    try {
      const invernaderos = await Invernadero.findAll({
        include: [{
          model: Zona,
          as: 'zonas',
          where: { estado_iluminacion: 'activo' },
          attributes: [],
          required: true,
        }],
        attributes: ['id_invernadero', 'nombre'],
        group: ['Invernadero.id_invernadero'],
        order: [['id_invernadero', 'ASC']],
      });
      res.json(invernaderos);
    } catch (error: any) {
      console.error('❌ Error al obtener los invernaderos con iluminación activa:', error);
      res.status(500).json({
        error: 'Error al obtener invernaderos con iluminación activa',
        details: error.message,
      });
    }
  };

  static getZonasActivas = async (req: Request, res: Response) => {
    try {
      const zonas = await Zona.findAll({
        where: { estado_iluminacion: 'activo' },
        attributes: ['id_zona', 'nombre'],
        order: [['id_zona', 'ASC']],
      });
      res.json(zonas);
    } catch (error: any) {
      console.error('❌ Error al obtener las zonas con iluminación activa:', error);
      res.status(500).json({
        error: 'Error al obtener zonas con iluminación activa',
        details: error.message,
      });
    }
  };
}