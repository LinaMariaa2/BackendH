import { Request, Response } from 'express';
import { Bitacora } from '../models/bitacora';
import { Invernadero } from '../models/invernadero';
import { Zona } from '../models/zona';
import { Persona } from '../models/Persona';
import { Op } from 'sequelize';


export class bitacoraController {
static getAll = async (req: Request, res: Response) => {
  try {
    const { archivadas } = req.query;

    let whereClause = {};
    if (archivadas === 'true') {
      whereClause = { archivada: true };
    } else if (archivadas === 'false') {
      whereClause = { archivada: false };
    }

    const publicaciones = await Bitacora.findAll({
      where: whereClause,
      include: [Invernadero, Zona, Persona],
      order: [['timestamp_publicacion', 'DESC']],
    });

    res.json(publicaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las publicaciones', details: error });
  }
};


  // Obtener publicación por ID
  static getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const publicacion = await Bitacora.findByPk(id, {
        include: [Invernadero, Zona, Persona],
      });
      if (!publicacion) {
       res.status(404).json({ error: 'Publicación no encontrada' });
        return ;
      }
      res.json(publicacion);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la publicación', details: error });
    }
  };

  // Crear publicación
  static crear = async (req: Request, res: Response) => {
    try {
      const nueva = await Bitacora.create(req.body);
      res.status(201).json({ mensaje: 'Publicación creada correctamente', nueva });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la publicación', details: error });
    }
    console.log("REQ BODY", req.body);
  };

  // Actualizar publicación
  static actualizar = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const [updated] = await Bitacora.update(req.body, { where: { id_publicacion: id } });

      if (updated === 0) {
        res.status(404).json({ error: 'Publicación no encontrada' });
         return;
      }

      res.json({ mensaje: 'Publicación actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la publicación', details: error });
    }
  };

  // Eliminar (solo si no es importante o archivable primero)
  static eliminar = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const publicacion = await Bitacora.findByPk(id);
      if (!publicacion) {
       res.status(404).json({ error: 'Publicación no encontrada' });
        return ;
      }

      await publicacion.destroy();
      res.json({ mensaje: 'Publicación eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la publicación', details: error });
    }
  };

  // Filtrar por invernadero
  static getByInvernadero = async (req: Request, res: Response) => {
    try {
      const { id_invernadero } = req.params;
      const publicaciones = await Bitacora.findAll({
        where: { id_invernadero },
        include: [Zona, Persona],
        order: [['timestamp_publicacion', 'DESC']],
      });
      res.json(publicaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener publicaciones del invernadero', details: error });
    }
  };
  
  // Archivar publicación (cambia importancia a 'baja')
  static archivar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const publicacion = await Bitacora.findByPk(id);
    if (!publicacion) {
      res.status(404).json({ error: 'Publicación no encontrada' });
      return ;
    }

    publicacion.archivada = true;
    await publicacion.save();

    res.json({ mensaje: 'Publicación archivada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al archivar la publicación', details: error });
  }
};

  // Desarchivar (poner importancia en 'media')
static desarchivar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const publicacion = await Bitacora.findByPk(id);
    if (!publicacion) {
      res.status(404).json({ error: 'Publicación no encontrada' });
      return ;
    }

    publicacion.archivada = false;
    await publicacion.save();

    res.json({ mensaje: 'Publicación desarchivada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al desarchivar', details: error });
  }
};
}
