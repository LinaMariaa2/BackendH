import type { Request, Response } from 'express';
import { GestionCultivo } from '../models/gestionarCultivos';
import Zona from '../models/zona';

export class gestionCultivoController {
  // Obtener todos los cultivos
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

  // Obtener cultivo por ID
  static getId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const cultivo = await GestionCultivo.findByPk(id);
      if (!cultivo) {
        res.status(404).json({ error: 'Cultivo no encontrado' });
         return;
      }
      res.json(cultivo);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el cultivo', details: error });
    }
  };

  static cambiarEstado = async (req: Request, res: Response) => {
  const { id, estado } = req.params;

  if (!['activo', 'finalizado'].includes(estado)) {
    res.status(400).json({ error: 'Estado no válido' });
    return ;
  }

  try {
    const cultivo = await GestionCultivo.findByPk(id);
    if (!cultivo) {
      res.status(404).json({ error: 'Cultivo no encontrado' });
      return ;
    }

    cultivo.estado = estado;
    await cultivo.save();

     res.json({ mensaje: 'Estado actualizado', cultivo });
     return ;
  } catch (error) {
     res.status(500).json({ error: 'Error al cambiar el estado', details: error });
     return;
  }
};


  // Obtener cultivos por zona
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
    }
  };

  // Crear cultivo
  static crearCultivo = async (req: Request, res: Response) => {
    try {
      const cultivo = await GestionCultivo.create({
        ...req.body,
        estado: 'activo', // forzamos el estado inicial
      });

      // Actualiza el cultivo actual de la zona (si usas zonaCultivoActual o similar)
  
      res.status(201).json({ mensaje: 'Cultivo registrado correctamente', cultivo });
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar cultivo', details: error });
    }
    console.log("📥 Datos recibidos:", req.body);
  };
  
}
