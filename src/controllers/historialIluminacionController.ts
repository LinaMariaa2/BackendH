import { Request, Response } from 'express';
import HistorialIluminacion from '../models/historialIluminacion';

export const getAllIluminacion = async (_req: Request, res: Response) => {
  try {
    const data = await HistorialIluminacion.findAll({
      order: [['fecha_creacion', 'DESC']],
    });
    res.status(200).json(data);
  } catch (err: any) {
    console.error('Error al obtener historial de iluminación:', err);
    res.status(500).json({
      message: 'Error interno al obtener historial de iluminación',
      error: err.message,
    });
  }
};

export const crearHistorialIluminacion = async (req: Request, res: Response) => {
  try {
    const { id_iluminacion, id_zona, fecha_activacion, duracion_minutos } = req.body;

    if (!id_iluminacion || !id_zona || !fecha_activacion || typeof duracion_minutos !== 'number') {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const nuevo = await HistorialIluminacion.create({
      id_iluminacion,
      id_zona,
      fecha_activacion: new Date(fecha_activacion),
      duracion_minutos,
    });

    res.status(201).json(nuevo);
  } catch (err: any) {
    console.error('Error al crear historial de iluminación:', err);
    res.status(500).json({
      message: 'Error interno al crear historial de iluminación',
      error: err.message,
    });
  }


// ✅ GET by ID
const getIluminacionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const historial = await HistorialIluminacion.findByPk(id);

    if (!historial) {
      res.status(404).json({ message: 'Registro de iluminación no encontrado' });
      return;
    }

    res.json(historial);
  } catch (error) {
    console.error('Error al obtener registro de iluminación:', error);
    res.status(500).json({ message: 'Error al obtener registro de iluminación' });
  }
};

// ✅ POST
const createIluminacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { zonaId, intensidad, fecha, duracion } = req.body;

    const nuevoHistorial = await HistorialIluminacion.create({
      zonaId,
      intensidad,
      fecha,
      duracion,
    });

    res.status(201).json(nuevoHistorial);
  } catch (error) {
    console.error('Error al crear registro de iluminación:', error);
    res.status(500).json({ message: 'Error al crear registro de iluminación' });
  }
}};
