import type { Request, Response } from 'express';
import Invernadero from '../models/invernadero';

export class invernaderoController {

  // Mostramos todos los invernaderos ACTIVOS
  static getAll = async (req: Request, res: Response) => {
    try {
      const invernaderos = await Invernadero.findAll({
        where: { estado: 'activo' },
        order: [['id_invernadero', 'ASC']], //ordenamos en ascendente con la PK
      });
      res.json(invernaderos); // solo se ejecuta
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los invernaderos', details: error });
    }
  };

  // Mostramos invernadero por ID en api
  static getId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const invernadero = await Invernadero.findByPk(id)
      if (!invernadero) {
        const error = new Error('Invernadero no encontrado')
        res.status(404).json({ error: error.message });
      }
      res.json(invernadero);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el invernadero', details: error });
    }
  };

  // Crear un nuevo invernadero
  static crearInvernadero = async (req: Request, res: Response) => {
    try {
      const invernadero = new Invernadero(req.body);
      await invernadero.save();
      res.status(201).json({ mensaje: 'Invernadero creado correctamente', invernadero });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el invernadero', details: error });
    }
  };

  // Actualizar un invernadero
  static actualizarInvernadero = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const [rowsUpdated] = await Invernadero.update(req.body, {
        where: { id_invernadero: id },
      });
      if (rowsUpdated === 0) {
      res.status(404).json({ error: 'Invernadero no encontrado' });
      }

      res.json({ mensaje: 'Invernadero actualizado correctamente' });
    } catch (error: any) {
      console.error('Error al actualizar invernadero:', error);
      res.status(500).json({ 
        error: 'Error al actualizar el invernadero', 
        detalles: error instanceof Error ? error.message : String(error) 
      });
    }
  };
  

  // Eliminar un invernadero (inactivar)
  static eliminarInvernadero = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await Invernadero.destroy({ where: { id_invernadero: id } });
      if (deleted === 0) {
        res.status(404).json({ error: 'Invernadero no encontrado' });
        return;
      }
      res.json({ mensaje: 'Invernadero eliminado correctamente' });
    } catch (error: any) {
      res.status(500).json({ error: 'Error al eliminar el invernadero', details: error.message });
    }
  };
}