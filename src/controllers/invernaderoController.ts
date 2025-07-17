import type { Request, Response } from 'express';
import Invernadero from '../models/invernadero';
import Zona from '../models/zona';
import { actualizarConteoZonas } from '../helpers/actualizarConteoZona';
import { Persona } from '../models/Persona';

export class invernaderoController {

  // obtenemos todos los Invernaderos
  static getAll = async (req: Request, res: Response) => {
  try {
    const invernaderos = await Invernadero.findAll({
      order: [['id_invernadero', 'ASC']],
    });

    // 🔄 Actualiza el conteo de zonas por cada invernadero
    for (const inv of invernaderos) {
      await actualizarConteoZonas(inv.id_invernadero);
    }

    // ✅ Recupera los invernaderos actualizados e incluye los datos del responsable
    const actualizados = await Invernadero.findAll({
      include: [
        {
          model: Persona,
          as: 'encargado', // <-- asegúrate que el alias coincida con tu modelo
          attributes: ['id_persona', 'nombre_usuario', 'rol', 'estado'],
        },
      ],
      order: [['id_invernadero', 'ASC']],
    });

    res.json(actualizados);
  } catch (error) {
    console.error('❌ Error al obtener invernaderos:', error);
    res.status(500).json({
      error: 'Error al obtener los invernaderos',
      details: error,
    });
  }
};

  //Invernaderos Activos
  static getAllActivos = async (req: Request, res: Response) => {
  try {
    const invernaderos = await Invernadero.findAll({
      where: { estado: 'activo' },
      order: [['id_invernadero', 'ASC']],
    });

    for (const inv of invernaderos) {
      await actualizarConteoZonas(inv.id_invernadero);
    }

    const actualizados = await Invernadero.findAll({
      where: { estado: 'activo' },
      order: [['id_invernadero', 'ASC']],
    });

    res.json(actualizados);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener todos los invernaderos activos',
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
    const totalInvernaderos = await Invernadero.count();
    if (totalInvernaderos >= 6) {
      res.status(400).json({ error: 'No se pueden crear más de 5 invernaderos' });
      return;
    }

    const {
      nombre,
      descripcion,
      zonas_totales,
      zonas_activas,
      responsable_id,
    } = req.body;

    if (!responsable_id) {
       res.status(400).json({ error: 'Falta el campo responsable_id' });
       return;
    }

    const nuevoInvernadero = await Invernadero.create({
      nombre,
      descripcion,
      zonas_totales,
      zonas_activas,
      responsable_id,
    });

    // 🔁 Volvemos a buscar el invernadero con include para traer al responsable
    const invernaderoConResponsable = await Invernadero.findByPk(nuevoInvernadero.id_invernadero, {
  include: [{ model: Persona, as: 'encargado' }],
});
res.status(201).json(invernaderoConResponsable);

  } catch (error: any) {
    console.error("Error al crear el invernadero:", error);
    res.status(500).json({
      error: 'Error al crear el invernadero',
      details: error.message,
    });
  }

  console.log("REQ.BODY:", req.body);
};


static cambiarEstadoGenerico = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosPermitidos = ['activo', 'inactivo', 'mantenimiento'];
    if (!estadosPermitidos.includes(estado)) {
       res.status(400).json({ error: 'Estado no válido' });
       return 
    }

    const invernadero = await Invernadero.findByPk(id);
    if (!invernadero) {
      res.status(404).json({ error: 'Invernadero no encontrado' });
      return 
    }

    if (estado !== 'activo') {
      const zonasActivas = await Zona.count({
        where: { id_invernadero: id, estado: 'activo' },
      });

      if (zonasActivas > 0) {
         res.status(400).json({
          error: 'No se puede cambiar el estado porque hay zonas activas asociadas a este invernadero.',
        });
      }
    }

    invernadero.estado = estado;
    await invernadero.save({ fields: ['estado'] });

   res.json({
      mensaje: 'Estado del invernadero actualizado correctamente',
      invernadero,
    });
  } catch (error) {
    console.error('Error al cambiar estado del invernadero:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
    return ;
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
      return;
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
  const { id } = req.params;

  try {
    const zonasActivas = await Zona.count({
      where: {
         id_invernadero: Number(id),
        estado: 'activo',
      },
    });

    if (zonasActivas > 0) {
      res.status(400).json({
        error: 'No se puede inactivar el invernadero. Tiene zonas activas.',
      });
      return;
    }

    const invernadero = await Invernadero.findByPk(id);
    if (!invernadero) {
      res.status(404).json({ error: 'Invernadero no encontrado' });
      return;
    }

    invernadero.estado = 'inactivo';
    await invernadero.save({ fields: ['estado'] });

    res.json({ mensaje: 'Invernadero inactivado correctamente' });
  } catch (error) {
    console.error('Error al inactivar invernadero:', error);
    res.status(500).json({ error: 'Error al inactivar invernadero', details: error });
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
  const { id } = req.params;

  try {
    const zonasActivas = await Zona.count({
      where: {
        id_invernadero: Number(id),
        estado: 'activo',
      },
    });

    if (zonasActivas > 0) {
      res.status(400).json({
        error: 'No se puede poner en mantenimiento. Tiene zonas activas.',
      });
      return;
    }

    const invernadero = await Invernadero.findByPk(id);
    if (!invernadero) {
      res.status(404).json({ error: 'Invernadero no encontrado' });
      return;
    }

    invernadero.estado = 'mantenimiento';
    await invernadero.save({ fields: ['estado'] });

    res.json({ mensaje: 'Invernadero puesto en mantenimiento correctamente' });
  } catch (error) {
    console.error('Error al poner en mantenimiento:', error);
    res.status(500).json({ error: 'Error al poner en mantenimiento', details: error });
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
      return;
      
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