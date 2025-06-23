import type { Request, Response } from 'express';
import Invernadero from '../models/invernadero';

export class invernaderoController {

  // obtenemos todos los Invernaderos
  static getAll = async (req: Request, res: Response) => {
    try {
      const invernaderos = await Invernadero.findAll({
        order: [['id_invernadero', 'ASC']], //ordenamos en ascendente con la PK
      });
      res.json(invernaderos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los invernaderos', details: error });
    }
  };

  //Invernaderos Activos
  static getAllActivos = async (req: Request, res: Response) => {
  try {
    const invernaderos = await Invernadero.findAll({
      where: { estado: 'activo' },
      order: [['id_invernadero', 'ASC']],
    });
    res.json(invernaderos);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener todos los invernaderos',
      details: error,
    });
  }
  };

  // Mostramos invernadero por ID en ruta
  static getId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const invernadero = await Invernadero.findByPk(id)
      if (!invernadero) {
        const error = new Error('Invernadero No encontrado, estas seguro de que existe')
        res.status(404).json({ error: error.message });
      }
      res.json(invernadero);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el invernadero', details: error });
      return;
    }
  };

  // Crear un nuevo invernadero con limite de 5 maximo
  static crearInvernadero = async (req: Request, res: Response) => {
  try {
    const totalInvernaderos = await Invernadero.count(); //cuenta los invernaderos existentes
    if (totalInvernaderos >= 5) {
      res.status(400).json({ 
        error: 'No se pueden crear más de 5 invernaderos'
      });
    }
    // Crear el nuevo invernadero
    const invernadero = new Invernadero(req.body);
    await invernadero.save();
    res.status(201).json({ mensaje: 'Invernadero creado correctamente'});
    return;
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al crear el invernadero', 
      details: error instanceof Error ? error.message : error 
    });
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
  
static inactivarInvernadero = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const invernadero = await Invernadero.findByPk(id);

    if (!invernadero) {
      res.status(404).json({ error: 'Invernadero no encontrado' });
      return;
    }
    invernadero.set('estado', 'inactivo');
    await invernadero.save({ fields: ['estado'] });

    res.json({ mensaje: 'Invernadero inactivado correctamente' });

  } catch (error: any) {
    res.status(500).json({
      error: 'Error al inactivar el invernadero',
      details: error.message,
    });
  }
};

static activarInvernadero = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const invernadero = await Invernadero.findByPk(id);

    if (!invernadero) {
      res.status(404).json({ error: 'Invernadero no encontrado' });
      return;
    }
    invernadero.set('estado', 'activo');
    await invernadero.save({ fields: ['estado'] });

    res.json({ mensaje: 'Invernadero activadp correctamente' });

  } catch (error: any) {
    res.status(500).json({
      error: 'Error al activar el invernadero',
      details: error.message,
    });
  }
};

static mantenimientoInvernadero = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const invernadero = await Invernadero.findByPk(id);

    if (!invernadero) {
      res.status(404).json({ error: 'Invernadero no encontrado' });
      return;
    }
    invernadero.set('estado', 'mantenimiento');
await invernadero.save({ fields: ['estado'] });

    res.json({ mensaje: 'Invernadero ´puestp en mantenimiento correctamente' });

  } catch (error: any) {
    res.status(500).json({
      error: 'Error al inactivar el invernadero en mantenimiento',
      details: error.message,
    });
  }
};

static eliminarInvernadero = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const invernadero = await Invernadero.findByPk(id);

    if (!invernadero) {
      res.status(404).json({ error: 'Invernadero no encontrado' });
    return;
    }

    if (invernadero.estado !== 'inactivo') {
      res.status(400).json({ error: 'Solo se puede eliminar un invernadero inactivo' });
      return;
    }
    const zonasActivas = await invernadero.$count('zonas', {
      where: { estado: 'activo' }
    });
    if (zonasActivas > 0) {
      res.status(400).json({
        error: 'No se puede eliminar el invernadero porque tiene zonas activas asociadas'
      });
    }
    await invernadero.destroy();
    res.json({ mensaje: 'Invernadero eliminado permanentemente' });
  } catch (error: any) {
    res.status(500).json({
      error: 'Error al eliminar el invernadero',
      details: error.message,
    });
  }
};




}