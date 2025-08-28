import { Request, Response } from 'express';
import HistorialIluminacion from '../models/historiaIIluminacion';

// ✅ GET all
export const getAllIluminacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const historial = await HistorialIluminacion.findAll();
    res.json(historial);
  } catch (error) {
    console.error('Error al obtener historial de iluminación:', error);
    res.status(500).json({ message: 'Error al obtener historial de iluminación' });
  }
};

// ✅ GET by ID
export const getIluminacionById = async (req: Request, res: Response): Promise<void> => {
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
export const createIluminacion = async (req: Request, res: Response): Promise<void> => {
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
};
