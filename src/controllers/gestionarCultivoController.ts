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

  static eliminarCultivo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cultivo = await GestionCultivo.findByPk(id);
    if (!cultivo) {
      res.status(404).json({ error: 'Cultivo no encontrado' });
      return ;
    }

    await cultivo.destroy();
    res.json({ mensaje: 'Cultivo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cultivo', details: error });
  }
};

static actualizarCultivo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cultivo = await GestionCultivo.findByPk(id);

    if (!cultivo) {
      res.status(404).json({ error: "Cultivo no encontrado" });
      return ;
    }

    await cultivo.update(req.body);
     res.json({ mensaje: "Cultivo actualizado", cultivo });
     return;
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar cultivo", details: error });
    return;
  }
};

static actualizarProduccion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let { cantidad_reservada, cantidad_cosechada, unidad_medida } = req.body;

    cantidad_cosechada = cantidad_cosechada !== undefined ? Number(cantidad_cosechada) : null;
    cantidad_reservada = cantidad_reservada !== undefined ? Number(cantidad_reservada) : null;

    if (
      (cantidad_cosechada !== null && (isNaN(cantidad_cosechada) || cantidad_cosechada < 0)) ||
      (cantidad_reservada !== null && (isNaN(cantidad_reservada) || cantidad_reservada < 0))
    ) {
      res.status(400).json({ error: 'Debe enviar cantidades válidas para actualizar.' });
      return;
    }

    const cultivo = await GestionCultivo.findByPk(id);
    if (!cultivo) {
     res.status(404).json({ error: 'Cultivo no encontrado' });
      return;
    }

    if (cantidad_cosechada !== null) {
      const diferencia = cantidad_cosechada - cultivo.cantidad_cosechada;
      cultivo.cantidad_disponible += diferencia;
      cultivo.cantidad_cosechada = cantidad_cosechada;
    }

    if (cantidad_reservada !== null) {
      if (cantidad_reservada > cultivo.cantidad_cosechada) {
        res.status(400).json({ error: 'La cantidad reservada no puede superar la cosechada' });
         return;
      }
      const diferencia = cantidad_reservada - cultivo.cantidad_reservada;
      cultivo.cantidad_disponible -= diferencia;
      cultivo.cantidad_reservada = cantidad_reservada;
    }

    if (unidad_medida) {
      cultivo.unidad_medida = unidad_medida;
    }

    await cultivo.save();
    res.json({ mensaje: 'Producción actualizada correctamente', cultivo });
     return;

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar producción', details: error });
     return;
  }
};



  
}
