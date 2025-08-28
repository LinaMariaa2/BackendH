// src/controllers/historialRiegoController.ts
import { Request, Response } from 'express';
import HistorialRiego from '../models/historialRiego';

/**
 * GET: Traer todos los registros del historial de riego
 */
export const getAllRiego = async (req: Request, res: Response) => {
  try {
    const historial = await HistorialRiego.findAll({
      order: [['fecha_creacion', 'DESC']], // del más reciente al más antiguo
    });

    if (!historial || historial.length === 0) {
      return res.status(200).json({ message: 'No hay historial de riego disponible', data: [] });
    }

    res.status(200).json(historial);
  } catch (err: any) {
    console.error('Error al obtener historial de riego:', err.message);
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
  }
};

/**
 * POST: Crear un registro en el historial de riego
 * Calcula automáticamente la duración en minutos
 */
export const crearHistorialRiego = async (req: Request, res: Response) => {
  try {
    const { id_pg_riego, id_zona, fecha_activacion, fecha_finalizacion } = req.body;

    // Validar datos obligatorios
    if (!id_pg_riego || !id_zona || !fecha_activacion || !fecha_finalizacion) {
      return res.status(400).json({ message: 'Faltan datos obligatorios para crear el historial' });
    }

    // Calcular duración en minutos
    const duracionMs = new Date(fecha_finalizacion).getTime() - new Date(fecha_activacion).getTime();
    const duracion_minutos = Math.round(duracionMs / 60000);

    // Crear el registro en la base de datos
    const nuevoHistorial = await HistorialRiego.create({
      id_pg_riego,
      id_zona,
      fecha_activacion: new Date(fecha_activacion),
      duracion_minutos,
    });

    res.status(201).json(nuevoHistorial);
  } catch (err: any) {
    console.error('Error al crear historial de riego:', err.message);
    res.status(500).json({ message: 'Error al registrar el riego', error: err.message });
  }
};
