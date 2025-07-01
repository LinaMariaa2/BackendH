import type { Request, Response } from 'express';
import {GestionCultivo} from '../models/gestionarCultivos';
import Zona from '../models/zona';

export class gestionCultivoController {
  static getAll = async (_req: Request, res: Response) => {
    try {
      const cultivos = await GestionCultivo.findAll({
        order: [['id_cultivo', 'ASC']],
      });
      res.json(cultivos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los cultivos', details: error });
    }
  };

  static getId = async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const gestionarCultivos = await GestionCultivo.findByPk(id)
        if (!gestionarCultivos) {
          const error = new Error('Invernadero No encontrado, estas seguro de que existe')
          res.status(404).json({ error: error.message });
        }
        res.json(gestionarCultivos);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener el invernadero', details: error });
        return;
      }
    };

  static getPorZona = async (req: Request, res: Response) => {
    const { id_zona } = req.params;
    try {
      const cultivos = await GestionCultivo.findAll({
        where: { id_zona },
        order: [['fecha_inicio', 'DESC']],
      });
      res.json(cultivos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener cultivos de la zona', details: error });
      return;
    }
  };

  static crearCultivo = async (req: Request, res: Response) => {
    try {
      const cultivo = await GestionCultivo.create(req.body);
      // Actualizamos cultivo actual de la zona (para dashboard en tiempo real)
      await Zona.update(
        { id_cultivo_actual: cultivo.id_cultivo },
        { where: { id_zona: cultivo.id_zona } }
      );
      res.status(201).json({ mensaje: 'Cultivo registrado correctamente', cultivo });
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar cultivo', details: error });
      return;
    }
  };

  
}