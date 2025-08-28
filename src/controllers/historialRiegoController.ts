// src/controllers/historialRiegoController.ts

import { Request, Response } from 'express';
import HistorialRiego from '../models/historialRiego';
import Invernadero from '../models/invernadero';
import Zona from '../models/zona'; // Importar Zona

// Obtener todos los registros de riego
export const getAllRiego = async (_req: Request, res: Response) => {
  try {
    const historial = await HistorialRiego.findAll({
      // Se incluye la tabla Zona para obtener datos relacionados
      include: [
        {
          model: Zona,
          as: 'zona', // 'as' debe coincidir con la relación definida en el modelo
          attributes: ['id_zona', 'nombre'], // Se obtienen solo las columnas necesarias
        },
      ],
      // Se ordena por fecha de activación de forma descendente (más recientes primero)
      order: [['fecha_activacion', 'DESC']],
    });
    console.log("Historial Riego desde backend:", historial);
    res.json(historial);
  } catch (error) {
    console.error('Error al obtener historial de riego:', error);
    res.status(500).json({ error: 'Error al obtener historial de riego' });
  }
};

// Obtener registros de riego por invernadero
export const getRiegoByInvernadero = async (req: Request, res: Response) => {
  try {
    const { invernaderoId } = req.params;

    const historial = await HistorialRiego.findAll({
      // Se filtra por la zona que pertenece al invernadero
      // Esto asume que hay una relación entre Zona e Invernadero
      include: [
        {
          model: Zona,
          as: 'zona',
          attributes: ['id_zona', 'nombre'],
          where: { invernaderoId },
        },
      ],
      order: [['fecha_activacion', 'DESC']],
    });

    res.json(historial);
  } catch (error) {
    console.error('Error al obtener historial de riego por invernadero:', error);
    res.status(500).json({ error: 'Error al obtener historial de riego por invernadero' });
  }
};